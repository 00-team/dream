function pad0(v: string | number): string {
    return v.toString().padStart(2, '0')
}

export function fmt_mdhm(ts: number): string {
    let now = new Date().getTime() / 1e3
    let expires = ts - now
    if (expires < 0) return 'Expired'

    let months = ~~(expires / 2592000)
    let O = months * 2592000
    let days = ~~((expires - O) / 86400)
    O = O + days * 86400
    let hours = ~~((expires - O) / 3600)
    O = O + hours * 3600
    let minutes = ~~((expires - O) / 60)

    let out = `${days} Days & ${pad0(hours)}:${pad0(minutes)}`
    if (months) out = months + ' Months & ' + out

    return out
}
