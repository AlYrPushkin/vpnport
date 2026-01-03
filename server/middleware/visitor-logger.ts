import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

// Получение IP адреса из запроса
function getClientIP(event: any): string {
  const headers = event.node.req.headers
  
  // Проверяем различные заголовки для получения реального IP
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    // x-forwarded-for может содержать несколько IP через запятую
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = headers['x-real-ip']
  if (realIP) {
    return realIP as string
  }
  
  const cfConnectingIP = headers['cf-connecting-ip'] // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP as string
  }
  
  // Fallback на socket адрес
  return event.node.req.socket?.remoteAddress || 'unknown'
}

interface LogEntry {
  url: string // Полный URL с query параметрами
  path: string // Только путь без query
  query: Record<string, string> // Query параметры как объект
  referer: string | null
  userAgent: string | null
  timestamp: string
  method: string
}

// Структура: { [ip: string]: LogEntry[] }
type LogsByIP = Record<string, LogEntry[]>

// Путь к файлу логов
const getLogFilePath = () => {
  const logsDir = join(process.cwd(), 'logs')
  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD
  return join(logsDir, `visitors-${today}.json`)
}

// Загрузка существующих логов
async function loadLogs(filePath: string): Promise<LogsByIP> {
  if (!existsSync(filePath)) {
    return {}
  }
  
  try {
    const content = await readFile(filePath, 'utf-8')
    const parsed = JSON.parse(content)
    
    // Поддержка старого формата (массив) для обратной совместимости
    if (Array.isArray(parsed)) {
      const converted: LogsByIP = {}
      parsed.forEach((entry: any) => {
        const ip = entry.ip || 'unknown'
        if (!converted[ip]) {
          converted[ip] = []
        }
        // Убираем поле ip из записи
        const { ip: _, ...logEntry } = entry
        converted[ip].push(logEntry)
      })
      return converted
    }
    
    return parsed
  } catch (error) {
    // Если файл поврежден, начинаем заново
    console.error('Error reading log file, starting fresh:', error)
    return {}
  }
}

// Сохранение логов
async function saveLogs(filePath: string, logs: LogsByIP): Promise<void> {
  const logsDir = join(process.cwd(), 'logs')
  
  // Создаем папку logs если её нет
  if (!existsSync(logsDir)) {
    await mkdir(logsDir, { recursive: true })
  }
  
  // Сохраняем в JSON формате с отступами для читаемости
  await writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  // Пропускаем статические файлы и API запросы к самому логгеру
  const url = getRequestURL(event)
  if (
    url.pathname.startsWith('/_nuxt') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/api/stats') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/i)
  ) {
    return
  }

  try {
    const ip = getClientIP(event)
    const referer = getHeader(event, 'referer') || null
    const userAgent = getHeader(event, 'user-agent') || null
    const method = event.node.req.method || 'GET'
    const timestamp = new Date().toISOString()

    // Получаем query параметры
    const queryParams: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const logEntry: LogEntry = {
      url: url.href, // Полный URL с query параметрами
      path: url.pathname, // Только путь
      query: queryParams, // Query параметры как объект
      referer,
      userAgent,
      timestamp,
      method
    }

    const logFilePath = getLogFilePath()
    const logs = await loadLogs(logFilePath)
    
    // Добавляем новую запись к IP адресу
    if (!logs[ip]) {
      logs[ip] = []
    }
    logs[ip].push(logEntry)
    
    // Сохраняем обновленный объект
    await saveLogs(logFilePath, logs)
  } catch (error) {
    // Тихая ошибка - не ломаем сайт из-за проблем с логированием
    console.error('Visitor logging error:', error)
  }
})

