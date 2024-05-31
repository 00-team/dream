export type ProductModel = {
    name: string
    logo: string
    data: string[]
    color: string
    image: string
    plans: { [k: string]: [number, string] }
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
