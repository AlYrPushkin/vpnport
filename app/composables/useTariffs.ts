import type {IPlan, IPlanView} from "~/components/types/plan";
import { computed, useState } from '#imports'
import {BEST_PLAN} from "~/components/consts";

const effectivePrice = (p: IPlan) =>
    p.discount_price && p.discount_price > 0 ? p.discount_price : p.price

export function useTariffs() {
    const raw = useState<IPlan[]>('tariffs:raw', () => [])
    const pending = useState<boolean>('tariffs:pending', () => false)
    const error = useState<unknown>('tariffs:error', () => null)

    const plans = computed<IPlanView[]>(() =>
        raw.value.map(p => ({
            price: p.discount_price || p.price,
            name: p.name,
            discount: p.discount_percent,
            oldPrice: p.discount_price ? p.price : null,
            is_best: p.name === BEST_PLAN
        } satisfies IPlanView ))
    )

    const minPrice = computed<number | null>(() => {
        const list = raw.value
        if (!list.length) return null
        return Math.min(...list.map(effectivePrice))
    })

    return {plans, pending, error, minPrice}
}
