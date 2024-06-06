import { Component, createSignal, onCleanup, onMount } from 'solid-js'

interface Props {
    end: number
    steps?: number
    interval: number
    onEnd?(): void
    format?: boolean
}

export const Counter: Component<Props> = P => {
    const [counter, setCounter] = createSignal(0)

    let timer: number

    onMount(() => {
        timer = setInterval(update, P.interval)
    })

    function update() {
        setCounter(value => {
            let n = value + P.steps || 1
            if (n > P.end) {
                n = P.end
                clearInterval(timer)
                P.onEnd && P.onEnd()
            }
            return n
        })
    }

    onCleanup(() => {
        clearInterval(timer)
    })

    return (
        <span>
            {P.format ? <>{counter().toLocaleString()}</> : <>{counter()}</>}
        </span>
    )
}
