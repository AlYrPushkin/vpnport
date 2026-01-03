import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

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

// Проверка на бота
function isBot(userAgent: string | null): boolean {
  if (!userAgent) return false
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /slurp/i,
    /mediapartners/i,
    /TelegramBot/i,
    /Googlebot/i,
    /Bingbot/i,
    /YandexBot/i,
    /facebookexternalhit/i,
    /Twitterbot/i,
    /LinkedInBot/i,
    /WhatsApp/i,
  ]
  return botPatterns.some(pattern => pattern.test(userAgent))
}

interface LogEntry {
  url: string
  path: string
  query: Record<string, string>
  referer: string | null
  userAgent: string | null
  timestamp: string
  method: string
  eventType?: 'page_view' | 'outbound_link' | 'page_unload' | 'page_hidden'
  targetUrl?: string
  timeOnPage?: number
  isBot?: boolean
}

type LogsByIP = Record<string, LogEntry[]>

const getLogFilePath = () => {
  const logsDir = join(process.cwd(), 'logs')
  const today = new Date().toISOString().split('T')[0]
  return join(logsDir, `visitors-${today}.json`)
}

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

async function saveLogs(filePath: string, logs: LogsByIP): Promise<void> {
  const logsDir = join(process.cwd(), 'logs')
  
  if (!existsSync(logsDir)) {
    await mkdir(logsDir, { recursive: true })
  }
  
  await writeFile(filePath, JSON.stringify(logs, null, 2), 'utf-8')
}

export default defineEventHandler(async (event) => {
  const url = getRequestURL(event)
  
  // Пропускаем служебные запросы
  if (
    url.pathname.startsWith('/_nuxt') ||
    url.pathname.startsWith('/favicon') ||
    url.pathname.startsWith('/api/stats') ||
    url.pathname.startsWith('/api/_nuxt_icon') ||
    url.pathname.startsWith('/__nuxt_error') ||
    url.pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot|json)$/i)
  ) {
    return
  }

  try {
    const ip = getClientIP(event)
    const referer = getHeader(event, 'referer') || null
    const userAgent = getHeader(event, 'user-agent') || null
    const method = event.node.req.method || 'GET'
    const timestamp = new Date().toISOString()
    const isBotRequest = isBot(userAgent)

    const queryParams: Record<string, string> = {}
    url.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const logEntry: LogEntry = {
      url: url.href,
      path: url.pathname,
      query: queryParams,
      referer,
      userAgent,
      timestamp,
      method,
      eventType: 'page_view',
      isBot: isBotRequest || undefined
    }

    const logFilePath = getLogFilePath()
    const logsDir = join(process.cwd(), 'logs')
    
    if (!existsSync(logsDir)) {
      try {
        await mkdir(logsDir, { recursive: true })
      } catch (mkdirError: any) {
        console.error(`[Visitor Logger] Failed to create logs directory:`, mkdirError.message)
        return
      }
    }
    
    const logs = await loadLogs(logFilePath)
    
    if (!logs[ip]) {
      logs[ip] = []
    }
    logs[ip].push(logEntry)
    
    try {
      await saveLogs(logFilePath, logs)
    } catch (writeError: any) {
      console.error(`[Visitor Logger] Failed to write log file:`, writeError.message)
    }
  } catch (error: any) {
    console.error('[Visitor Logger] Error:', error.message)
  }
})
