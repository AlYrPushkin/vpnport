export interface IPlan {
    name: string
    price: number
    discount_price: number
    discount_percent: number
    duration_days: number
    traffic_limit: number
    connections_limit: number
    is_best?: boolean
}
export interface IPlanView {
    name: string
    price: number
    discount: number
    oldPrice: number | null
    is_best?: boolean
}