export type OrderModel = {
    data: { [k: string]: string }
    id: number
    kind: string
    price: number
    status: 'wating' | 'refunded' | 'done'
    timestamp: number
    user: number
}

export type UserModel = {
    admin: boolean
    banned: boolean
    id: number
    in_hold: number
    name: string | null
    phone: string
    photo: string | null
    token: string
    wallet: number
}

export type TransactionModel = {
    amount: number
    bank_track_id: number | null
    card: string | null
    date: number | null
    hashed_card: string | null
    id: number
    kind: 'in' | 'out'
    status: 'in_progress' | 'failed' | 'success'
    timestamp: number
    user: number
    vendor: 'zarinpal' | 'zibal'
    vendor_order_id: string | null
    vendor_track_id: number | null
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

export type ProductModel = {
    name: string
    logo: string
    data: string[]
    color: string
    image: string
    plans: { [k: string]: [number, string] }
}
