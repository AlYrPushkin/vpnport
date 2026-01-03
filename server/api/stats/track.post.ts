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
  eventType?: 'page_view' | 'outbound_link' | 'page_unload' | 'page_hidden'
  targetUrl?: string
  timeOnPage?: number
}

type LogsByIP = Record<string, LogEntry[]>

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
    console.error('Error reading log file:', error)
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
  try {
    const body = await readBody(event)
    const ip = getClientIP(event)
    const userAgent = getHeader(event, 'user-agent') || null
    const timestamp = body.timestamp || new Date().toISOString()
    
    // Берем URL из referer (реальный URL страницы), а не из body.currentUrl
    const referer = getHeader(event, 'referer') || null
    let pageUrl: URL
    
    // Пробуем использовать referer как источник реального URL
    if (referer) {
      try {
        pageUrl = new URL(referer)
      } catch {
        pageUrl = new URL(body.currentUrl || 'http://unknown/')
      }
    } else {
      try {
        pageUrl = new URL(body.currentUrl || 'http://unknown/')
      } catch {
        pageUrl = new URL('http://unknown/')
      }
    }

    const queryParams: Record<string, string> = {}
    pageUrl.searchParams.forEach((value, key) => {
      queryParams[key] = value
    })

    const logEntry: LogEntry = {
      url: pageUrl.href,
      path: pageUrl.pathname,
      query: queryParams,
      referer: null, // Для клиентских событий referer не нужен
      userAgent,
      timestamp,
      method: 'POST',
      eventType: body.type || 'page_view',
      targetUrl: body.targetUrl || undefined,
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
    console.error('[Track API] Error:', error.message)
    return { success: false, error: error.message }
  }
})
