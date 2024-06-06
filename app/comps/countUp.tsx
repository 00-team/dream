import { Component, createSignal, onCleanup, onMount } from 'solid-js'

interface CountUpProps {
    end: number
    steps?: number
    addTime: number
    cb?: () => void
    format?: boolean
}

const CountUp: Component<CountUpProps> = props => {
    const [counter, setCounter] = createSignal(0)

    let interval: number

    onMount(() => {
        interval = setInterval(updateCount, props.addTime)
    })

    function updateCount() {
        if (counter() < props.end) {
            setCounter(value => (value += props.steps || 1))

            if (counter() > props.end) {
                setCounter(() => props.end)
            }
        } else {
            clearInterval(interval)
            props.cb && props.cb()
            return
        }
    }

    onCleanup(() => {
        clearInterval(interval)
    })

    return (
        <span>
            {props.format ? (
                <>{counter().toLocaleString()}</>
            ) : (
                <>{counter()}</>
            )}
        </span>
    )
}

export default CountUp
