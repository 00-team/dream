import { createEffect, createSignal } from 'solid-js'

const [theme, setTheme] = createSignal<'light' | 'dark'>('light')

export { theme, setTheme }
