import { readFile, readdir } from 'fs/promises'
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
  eventType?: 'page_view' | 'outbound_link' | 'page_unload' | 'page_hidden'
  targetUrl?: string
  timeOnPage?: number
}

// Структура: { [ip: string]: LogEntry[] }
type LogsByIP = Record<string, LogEntry[]>

// Преобразование LogsByIP в плоский массив с IP
function flattenLogs(logs: LogsByIP): Array<LogEntry & { ip: string }> {
  const result: Array<LogEntry & { ip: string }> = []
  Object.entries(logs).forEach(([ip, entries]) => {
    entries.forEach(entry => {
      result.push({ ...entry, ip })
    })
  })
  return result
}

export default defineEventHandler(async (event) => {
  const logsDir = join(process.cwd(), 'logs')
  
  if (!existsSync(logsDir)) {
    return {
      total: 0,
      uniqueIPs: 0,
      today: 0,
      uniqueToday: 0,
      queryStats: {},
      pathStats: {},
      recentEntries: []
    }
  }

  try {
    const files = await readdir(logsDir)
    const logFiles = files.filter(f => f.startsWith('visitors-') && f.endsWith('.json'))
    
    const allLogs: LogsByIP = {}
    const today = new Date().toISOString().split('T')[0]
    const todayFile = `visitors-${today}.json`
    
    // Читаем только сегодняшний файл
    const filesToRead = logFiles.filter(f => f === todayFile)
    
    for (const file of filesToRead) {
      const filePath = join(logsDir, file)
      try {
        const content = await readFile(filePath, 'utf-8')
        const parsed = JSON.parse(content)
        
        // Поддержка старого формата (массив) для обратной совместимости
        let logs: LogsByIP
        if (Array.isArray(parsed)) {
          logs = {}
          parsed.forEach((entry: any) => {
            const ip = entry.ip || 'unknown'
            if (!logs[ip]) {
              logs[ip] = []
            }
            const { ip: _, ...logEntry } = entry
            logs[ip].push(logEntry)
          })
        } else {
          logs = parsed
        }
        
        // Объединяем логи по IP
        Object.entries(logs).forEach(([ip, entries]) => {
          if (!allLogs[ip]) {
            allLogs[ip] = []
          }
          allLogs[ip].push(...entries)
        })
      } catch (e) {
        console.error(`Error reading ${file}:`, e)
      }
    }

    // Преобразуем в плоский массив для статистики
    const allEntries = flattenLogs(allLogs)
    const uniqueIPs = Object.keys(allLogs)
    const todayEntries = allEntries.filter(e => e.timestamp.startsWith(today))
    const uniqueTodayIPs = new Set(todayEntries.map(e => e.ip))

    // Статистика по query параметрам
    const queryStats: Record<string, Record<string, number>> = {}
    todayEntries.forEach(entry => {
      Object.entries(entry.query).forEach(([key, value]) => {
        if (!queryStats[key]) {
          queryStats[key] = {}
        }
        queryStats[key][value] = (queryStats[key][value] || 0) + 1
      })
    })

    // Статистика по путям
    const pathStats: Record<string, number> = {}
    todayEntries.forEach(entry => {
      pathStats[entry.path] = (pathStats[entry.path] || 0) + 1
    })

    return {
      total: allEntries.length,
      uniqueIPs: uniqueIPs.length,
      today: todayEntries.length,
      uniqueToday: uniqueTodayIPs.size,
      queryStats,
      pathStats,
      recentEntries: allEntries.slice(-100).reverse(), // Последние 100 записей
      logsByIP: allLogs // Возвращаем также структуру по IP
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to read logs'
    })
  }
})

