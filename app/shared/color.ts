export function hex_to_rgb(color: string): string {
    let r = parseInt(color.slice(1, 3), 16)
    let g = parseInt(color.slice(3, 5), 16)
    let b = parseInt(color.slice(5, 7), 16)

    return `${r}, ${g}, ${b}`
}
