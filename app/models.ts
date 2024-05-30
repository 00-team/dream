export type Product = {
    kind: string
    name: string
    cost: number
    logo: string
    color: string
    image: string
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
