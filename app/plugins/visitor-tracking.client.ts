export default defineNuxtPlugin(() => {
  if (!import.meta.client) return

  // Флаг чтобы не отправлять дубли при закрытии
  let unloadSent = false

  // Отслеживание кликов по внешним ссылкам
  const trackOutboundLink = (targetUrl: string) => {
    const data = {
      type: 'outbound_link',
      targetUrl: targetUrl,
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
      // Fallback на sendBeacon
      navigator.sendBeacon('/api/stats/track', JSON.stringify(data))
    })
  }

  // Отслеживание закрытия вкладки (только один раз)
  const trackPageUnload = () => {
    if (unloadSent) return
    unloadSent = true

    const data = {
      type: 'page_unload',
      timestamp: new Date().toISOString(),
      currentUrl: window.location.href,
      timeOnPage: Date.now() - (window as any).__pageLoadTime
    }

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
  }, true)

  // Отслеживание закрытия вкладки (только beforeunload, без дублей)
  window.addEventListener('beforeunload', trackPageUnload)
})
