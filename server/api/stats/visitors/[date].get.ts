import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

interface LogEntry {
  url: string
  path: string
  query: Record<string, string>
  referer: string | null
  userAgent: string | null
  timestamp: string
  method: string
}

// Структура: { [ip: string]: LogEntry[] }
type LogsByIP = Record<string, LogEntry[]>

export default defineEventHandler(async (event) => {
  const date = getRouterParam(event, 'date')
  
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid date format. Use YYYY-MM-DD'
    })
  }

  const logFilePath = join(process.cwd(), 'logs', `visitors-${date}.json`)
  
  if (!existsSync(logFilePath)) {
    return {
      date,
      logsByIP: {},
      total: 0,
      uniqueIPs: 0
    }
  }

  try {
    const content = await readFile(logFilePath, 'utf-8')
    const parsed = JSON.parse(content)
    
    // Поддержка старого формата (массив) для обратной совместимости
    let logsByIP: LogsByIP
    if (Array.isArray(parsed)) {
      logsByIP = {}
      parsed.forEach((entry: any) => {
        const ip = entry.ip || 'unknown'
        if (!logsByIP[ip]) {
          logsByIP[ip] = []
        }
        const { ip: _, ...logEntry } = entry
        logsByIP[ip].push(logEntry)
      })
    } else {
      logsByIP = parsed
    }

    const uniqueIPs = Object.keys(logsByIP)
    const total = Object.values(logsByIP).reduce((sum, entries) => sum + entries.length, 0)

    return {
      date,
      logsByIP,
      total,
      uniqueIPs: uniqueIPs.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to read log file'
    })
  }
})

