import {computed, useState} from '#imports'

type TgState = {
    yclid: string | null
    clientId: string | null
    link: string | null
}

export function useTgStartLink() {
    const st = useState<TgState>('tg:start', () => ({
        yclid: null,
        clientId: null,
        link: null,
    }))
    return  computed(() => st.value.link)
}
