function pad0(v: string | number): string {
    return v.toString().padStart(2, '0')
}

type ParsedSeconds = {
    months: number
    days: number
    hours: number
    minutes: number
}
export function fmt_parse_seconds(seconds: number): ParsedSeconds {
    let months = ~~(seconds / 2592000)
    let O = months * 2592000
    let days = ~~((seconds - O) / 86400)
    O = O + days * 86400
    let hours = ~~((seconds - O) / 3600)
    O = O + hours * 3600
    let minutes = ~~((seconds - O) / 60)

    return {
        months,
        days,
        hours,
        minutes,
    }
}

export function fmt_mdhm(ts: number): string {
    let now = new Date().getTime() / 1e3
    let expires = ts - now
    if (expires < 0) return 'Expired'
    let { months, days, hours, minutes } = fmt_parse_seconds(expires)
    return `${months} Months & ${days} Days & ${pad0(hours)}:${pad0(minutes)}`
}
