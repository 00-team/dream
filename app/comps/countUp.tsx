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

    let countElement: HTMLElement | null
    let interval

    onMount(() => {
        countElement = document.querySelector('#counter-elem')

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
        <span id='counter-elem'>
            {props.format ? (
                <>
                    {counter()
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                </>
            ) : (
                <>{counter()}</>
            )}
        </span>
    )
}

export default CountUp
