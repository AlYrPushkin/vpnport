export function useDirectIds(counterId = 105843920) {
    const route = useRoute()

    const getYclid = () => {
        const q = route.query.yclid
        return (Array.isArray(q) ? q[0] : q) || null
    }

    const saveYclid = () => {
        if (!import.meta.client) return
        const yclid = getYclid()
        if (yclid) localStorage.setItem('yclid', yclid)
    }

    const waitYm = (timeoutMs = 3000) =>
        new Promise<void>((resolve, reject) => {
            const start = Date.now()
            const t = setInterval(() => {
                if (typeof (window as any).ym === 'function') {
                    clearInterval(t);
                    resolve();
                    return
                }
                if (Date.now() - start > timeoutMs) {
                    clearInterval(t);
                    reject(new Error('ym not loaded'));
                    return
                }
            }, 50)
        })

    const saveClientId = async () => {
        if (!import.meta.client) return

        try {
            await waitYm()
            return await new Promise<string | null>((resolve) => {
                ;(window as any).ym(counterId, 'getClientID', (cid: string) => {
                    if (cid) localStorage.setItem('metrika_client_id', cid)
                    resolve(cid || null)
                })
            })
        } catch {
            return null // адблок/консент/сеть — норм
        }
    }

    onMounted(() => {
        saveYclid()
        saveClientId()
    })

    watch(() => route.query.yclid, () => saveYclid())

    return {
        yclid: import.meta.client ? localStorage.getItem('yclid') : null,
        metrikaClientId: import.meta.client ? localStorage.getItem('metrika_client_id') : null,
        saveClientId,
    }
}
