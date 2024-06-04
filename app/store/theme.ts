import { createEffect, createSignal } from 'solid-js'

const [theme, setTheme] = createSignal<'light' | 'dark'>('dark')

export { theme, setTheme }
