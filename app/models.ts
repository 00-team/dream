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
    status: 'wating' | 'refunded' | 'done'
    timestamp: number
    user: number
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
