# API логирования посетителей

Система логирования отслеживает всех посетителей сайта, записывая IP адреса, URL, query параметры, источники переходов и действия пользователей.

---

## Endpoints

### 1. Получение статистики за сегодня

**GET** `/api/stats/visitors`

#### Ответ:
```json
{
  "total": 150,
  "uniqueIPs": 25,
  "today": 150,
  "uniqueToday": 25,
  "queryStats": {
    "utm_source": { "google": 10, "yandex": 5 },
    "ref": { "promo": 3 }
  },
  "pathStats": {
    "/": 100,
    "/bot": 50
  },
  "recentEntries": [...],
  "logsByIP": {
    "192.168.1.1": [...]
  }
}
```

#### Поля ответа:

| Поле | Описание |
|------|----------|
| `total` | Общее количество записей за сегодня |
| `uniqueIPs` | Количество уникальных IP адресов |
| `today` | Количество записей за сегодня |
| `uniqueToday` | Уникальные IP за сегодня |
| `queryStats` | Статистика по query параметрам |
| `pathStats` | Статистика по путям (страницам) |
| `recentEntries` | Последние 100 записей |
| `logsByIP` | Полная структура логов по IP |

---

### 2. Получение логов за конкретную дату

**GET** `/api/stats/visitors/{date}`

#### Параметры:

| Параметр | Формат | Пример |
|----------|--------|--------|
| `date` | `YYYY-MM-DD` | `2026-01-03` |

#### Пример запроса:
```
GET /api/stats/visitors/2026-01-03
```

#### Ответ:
```json
{
  "date": "2026-01-03",
  "logsByIP": {
    "192.168.1.1": [
      {
        "url": "https://vpn-port.com/?utm_source=google",
        "path": "/",
        "query": { "utm_source": "google" },
        "referer": "https://google.com",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2026-01-03T10:30:00.000Z",
        "method": "GET",
        "eventType": "page_view"
      },
      {
        "url": "https://vpn-port.com/",
        "path": "/",
        "query": {},
        "referer": null,
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2026-01-03T10:35:00.000Z",
        "method": "POST",
        "eventType": "outbound_link",
        "targetUrl": "https://t.me/vpn_portbot"
      }
    ]
  },
  "total": 150,
  "uniqueIPs": 25
}
```

---

## Типы событий (eventType)

| Тип | Описание |
|-----|----------|
| `page_view` | Просмотр страницы (серверное событие) |
| `outbound_link` | Переход по внешней ссылке (клиентское событие) |
| `page_unload` | Закрытие вкладки/страницы (клиентское событие) |

> Примечание: `page_hidden` убран для уменьшения шума в логах.

---

## Структура записи лога

```json
{
  "url": "https://vpn-port.com/?param=value",
  "path": "/",
  "query": { "param": "value" },
  "referer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "timestamp": "2026-01-03T10:30:00.000Z",
  "method": "GET",
  "eventType": "page_view",
  "targetUrl": "https://t.me/vpn_portbot",
  "timeOnPage": 60000
}
```

| Поле | Описание |
|------|----------|
| `url` | Полный URL с query параметрами |
| `path` | Путь без query параметров |
| `query` | Query параметры как объект |
| `referer` | Откуда пришел пользователь |
| `userAgent` | Браузер/устройство |
| `timestamp` | Время события (ISO 8601) |
| `method` | HTTP метод |
| `eventType` | Тип события |
| `targetUrl` | URL перехода (для `outbound_link`) |
| `timeOnPage` | Время на странице в мс (для `page_unload`) |
| `isBot` | `true` если запрос от бота (TelegramBot, Googlebot и т.д.) |

---

## Команды для работы с логами

### Просмотр логов через API

```bash
# Статистика за сегодня
curl https://vpn-port.com/api/stats/visitors

# Логи за конкретную дату
curl https://vpn-port.com/api/stats/visitors/2026-01-03
```

### Экспорт логов из Docker контейнера

```bash
# Скопировать все логи в папку ./logs-backup
docker cp $(docker-compose ps -q app):/app/logs ./logs-backup

# Скопировать конкретный файл
docker cp $(docker-compose ps -q app):/app/logs/visitors-2026-01-03.json ./

# Посмотреть лог прямо в контейнере
docker-compose exec app cat /app/logs/visitors-2026-01-03.json

# Список файлов логов
docker-compose exec app ls -la /app/logs/
```

### Если используется bind mount (`./logs:/app/logs`)

```bash
# Логи уже на хосте в папке ./logs
ls -la ./logs/
cat ./logs/visitors-2026-01-03.json
```

---

## Хранение логов

### Формат файлов

- Каждый день создается новый файл: `visitors-YYYY-MM-DD.json`
- Структура: `{ [ip: string]: LogEntry[] }`
- Все записи группируются по IP адресу

### Пример файла

```json
{
  "192.168.1.1": [
    {
      "url": "https://vpn-port.com/",
      "path": "/",
      "query": {},
      "referer": null,
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2026-01-03T10:30:00.000Z",
      "method": "GET",
      "eventType": "page_view"
    }
  ],
  "192.168.1.2": [
    {
      "url": "https://vpn-port.com/?utm_source=google",
      "path": "/",
      "query": { "utm_source": "google" },
      "referer": "https://google.com",
      "userAgent": "Mozilla/5.0...",
      "timestamp": "2026-01-03T11:00:00.000Z",
      "method": "GET",
      "eventType": "page_view"
    }
  ]
}
```

---

## Важно

### Логи НЕ перетираются при пересборке

- При `docker-compose up -d --build` volumes сохраняются
- При `docker-compose down` volumes сохраняются
- Логи удаляются только при `docker-compose down -v` (флаг `-v` удаляет volumes)

### Ротация логов

- Каждый день создается новый файл
- Старые файлы не удаляются автоматически
- При необходимости удаляйте старые файлы вручную

### Права доступа (Docker)

Если используется bind mount и возникает ошибка `EACCES`:

```bash
sudo chown -R 1001:1001 ./logs
chmod 755 ./logs
```

---

## Фильтры (что НЕ логируется)

- `/_nuxt/*` — статика Nuxt
- `/favicon*` — иконки
- `/api/stats/*` — API логирования
- `/api/_nuxt_icon/*` — иконки Nuxt
- `/__nuxt_error` — страницы ошибок
- Файлы: `.ico`, `.png`, `.jpg`, `.svg`, `.css`, `.js`, `.json` и др.

---

## Файлы системы логирования

| Файл | Описание |
|------|----------|
| `server/middleware/visitor-logger.ts` | Middleware для логирования page_view |
| `server/api/stats/visitors.get.ts` | API статистики за сегодня |
| `server/api/stats/visitors/[date].get.ts` | API логов за дату |
| `server/api/stats/track.post.ts` | API для клиентских событий |
| `app/plugins/visitor-tracking.client.ts` | Клиентский трекер переходов |

