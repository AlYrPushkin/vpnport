type TgState = {
    yclid: string | null
    clientId: string | null
    link: string | null
}

export default defineNuxtPlugin(() => {
    if (!import.meta.client) return

    const config = useRuntimeConfig()
    const counterId = Number(config.public.metrikaCounterId) || 105843920
    const botName = 'vpn_portbot'

    const st = useState<TgState>('tg:start', () => ({
        yclid: null,
        clientId: null,
        link: `https://t.me/${botName}`, // сразу базовая
    }))

    // чтобы не запускать повторно при HMR/повторных инициализациях
    const started = useState<boolean>('tg:start:started', () => false)
    if (started.value) return
    started.value = true

    const build = () => {
        const base = `https://t.me/${botName}`
        if (!st.value.yclid || !st.value.clientId) {
            st.value.link = base
            return
        }
        st.value.link = `${base}?start=${encodeURIComponent(`y_${st.value.yclid}_${st.value.clientId}`)}`
    }

    // 1) yclid — сразу
    st.value.yclid = new URLSearchParams(window.location.search).get('yclid')
    build()

    // 2) clientId — надёжно: ждём появления ym, потом вызываем getClientID
    let asked = false
    let tries = 0
    const maxTries = 40 // 40 * 50ms = 2 секунды

    const tick = () => {
        if (asked) return

        const ym = (window as any).ym
        if (typeof ym === 'function') {
            asked = true
            ym(counterId, 'getClientID', (cid: string) => {
                st.value.clientId = cid || null
                build()
            })
            return
        }

        if (++tries >= maxTries) return
        setTimeout(tick, 50)
    }

    tick()
})
