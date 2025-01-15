export type CartStorage = {
    action: 'show'
    order: {
        kind: string
        plan: string
        data: { [k: string]: string }
        discount: string | null
    }
}

export type ProductModel = {
    name: string
    logo: string
    data: string[]
    color: string
    image: string
    plans: { [k: string]: [number, string] }
}

export type TransactionType = {
    amount: number
    bank_track_id: number
    card: string
    date: number
    hashed_card: string
    id: number
    kind: 'in' | 'out'
    status: 'in_progress' | 'failed' | 'success'
    timestamp: number
    user: number
    vendor: 'zarinpal' | 'zibal'
    vendor_order_id: string
    vendor_track_id: number
}

export type OrderType = {
    data: {}
    id: number
    kind: string
    price: number
    status: 'waiting' | 'refunded' | 'done'
    timestamp: number
    user: number
    img: string
}

export type UserModel = {
    id: number
    admin: boolean
    banned: boolean
    in_hold: number
    name: string | null
    phone: string
    photo: string | null
    token: string
    wallet: number
}

export type DiscountModel = {
    id: number
    code: string
    amount: number
    uses: number
    disabled: boolean
    expires: number | null
    kind: string | null
    max_uses: number | null
    plan: string | null
}
