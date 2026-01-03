export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  // Отслеживание кликов по внешним ссылкам
  const trackOutboundLink = (url: string) => {
    // Используем sendBeacon для надежной отправки при закрытии страницы
    const data = {
      type: 'outbound_link',
      url: url,
      timestamp: new Date().toISOString(),
      currentUrl: window.location.href
    }

    // Пробуем отправить через fetch с keepalive
    fetch('/api/stats/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      keepalive: true
    } as any).catch(() => {
      // Fallback на sendBeacon если fetch не поддерживает keepalive
      navigator.sendBeacon('/api/stats/track', JSON.stringify(data))
    })
  }

  // Отслеживание закрытия вкладки/окна
  const trackPageUnload = () => {
    const data = {
      type: 'page_unload',
      timestamp: new Date().toISOString(),
      currentUrl: window.location.href,
      timeOnPage: Date.now() - (window as any).__pageLoadTime
    }

    // sendBeacon гарантирует отправку даже при закрытии страницы
    navigator.sendBeacon('/api/stats/track', JSON.stringify(data))
  }

  // Сохраняем время загрузки страницы
  ;(window as any).__pageLoadTime = Date.now()

  // Обработчик кликов по ссылкам
  document.addEventListener('click', (event) => {
    const target = event.target as HTMLElement
    const link = target.closest('a')
    
    if (!link) return

    const href = link.getAttribute('href')
    if (!href) return

    try {
      const linkUrl = new URL(href, window.location.origin)
      const currentUrl = new URL(window.location.href)

      // Отслеживаем только внешние ссылки (другой домен)
      if (linkUrl.origin !== currentUrl.origin) {
        trackOutboundLink(linkUrl.href)
      }
    } catch (e) {
      // Игнорируем некорректные URL
    }
  }, true) // Используем capture phase для перехвата всех кликов

  // Отслеживание закрытия вкладки
  window.addEventListener('beforeunload', () => {
    trackPageUnload()
  })

  // Также отслеживаем unload (на случай если beforeunload не сработал)
  window.addEventListener('unload', () => {
    trackPageUnload()
  })

  // Отслеживание видимости страницы (когда пользователь переключает вкладку)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Страница скрыта - возможно пользователь переключил вкладку
      const data = {
        type: 'page_hidden',
        timestamp: new Date().toISOString(),
        currentUrl: window.location.href
      }
      navigator.sendBeacon('/api/stats/track', JSON.stringify(data))
    }
  })
})

