import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

interface LogEntry {
  url: string
  path: string
  query: Record<string, string>
  referer: string | null
  userAgent: string | null
  timestamp: string
  method: string
  // Новые поля для отслеживания переходов
  eventType?: 'page_view' | 'outbound_link' | 'page_unload' | 'page_hidden'
  targetUrl?: string // URL на который перешел пользователь
  timeOnPage?: number // Время на странице в миллисекундах
}

type LogsByIP = Record<string, LogEntry[]>

// Получение IP адреса из запроса
function getClientIP(event: any): string {
  const headers = event.node.req.headers
  
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  
  const realIP = headers['x-real-ip']
  if (realIP) {
    return realIP as string
  }
  
  const cfConnectingIP = headers['cf-connecting-ip']
  if (cfConnectingIP) {
    return cfConnectingIP as string
  }
  
  return event.node.req.socket?.remoteAddress || 'unknown'
}

// Путь к файлу логов
const getLogFilePath = () => {
  const logsDir = join(process.cwd(), 'logs')
  const today = new Date().toISOString().split('T')[0]
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
    
    if (Array.isArray(parsed)) {
      const converted: LogsByIP = {}
      parsed.forEach((entry: any) => {
        const ip = entry.ip || 'unknown'
        if (!converted[ip]) {
          converted[ip] = []
        }
        const { ip: _, ...logEntry } = entry
        converted[ip].push(logEntry)
      })
      return converted
    }
    
    return parsed
  } catch (error) {
    console.error('Error reading log file, starting fresh:', error)
    return {}
  }
}

// Сохранение логов
async function saveLogs(filePath: string, logs: LogsByIP): Promise<void> {
  const logsDir = join(process.cwd(), 'logs')
  
  if (!existsSync(logsDir)) {
    await mkdir(logsDir, { recursive: true })
  }
  
  await writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const ip = getClientIP(event)
    const userAgent = getHeader(event, 'user-agent') || null
    const referer = getHeader(event, 'referer') || null
    const timestamp = body.timestamp || new Date().toISOString()

    // Парсим текущий URL из body
    let currentUrl: URL
    try {
      currentUrl = new URL(body.currentUrl || 'http://localhost/')
    } catch {
      currentUrl = new URL('http://localhost/')
    }

    const queryParams: Record<string, string> = {}
    currentUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const logEntry: LogEntry = {
      url: currentUrl.href,
      path: currentUrl.pathname,
      query: queryParams,
      referer,
      userAgent,
      timestamp,
      method: 'POST',
      eventType: body.type || 'page_view',
      targetUrl: body.url || undefined,
      timeOnPage: body.timeOnPage || undefined
    }

    const logFilePath = getLogFilePath()
    const logs = await loadLogs(logFilePath)
    
    if (!logs[ip]) {
      logs[ip] = []
    }
    logs[ip].push(logEntry)
    
    await saveLogs(logFilePath, logs)

    return { success: true }
  } catch (error: any) {
    console.error('[Track API] Error:', error)
    return { success: false, error: error.message }
  }
})

