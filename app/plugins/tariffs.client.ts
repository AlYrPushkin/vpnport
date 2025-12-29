import type {IPlan} from "~/components/types/plan";

const TARIFFS_URL = 'https://api.vpn-port.com:8443/api/v1/tariffs/'

export default defineNuxtPlugin(() => {
    const raw = useState<IPlan[]>('tariffs:raw', () => [])
    const pending = useState<boolean>('tariffs:pending', () => false)
    const error = useState<unknown>('tariffs:error', () => null)
    const loaded = useState<boolean>('tariffs:loaded', () => false)

    if (loaded.value) return // чтобы 20 компонентов/плагинов не вызвали повторно

    loaded.value = true
    pending.value = true

    void (async () => {
        try {
            raw.value = await $fetch<IPlan[]>(TARIFFS_URL)
        } catch (e) {
            error.value = e
            raw.value = []
        } finally {
            pending.value = false
        }
    })()
})