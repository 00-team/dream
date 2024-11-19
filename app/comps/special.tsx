import { A } from '@solidjs/router'
import { Component } from 'solid-js'

import './style/special.scss'

interface SpecialProps {
    text: string
    class?: string
    link?: string
    onclick?: () => void
}

export const Special: Component<SpecialProps> = P => {
    return (
        <A
            href={P.link ? P.link : ''}
            class={`special title_smaller ${P.class || ''}`}
            onclick={P.onclick && P.onclick}
        >
            <span>{P.text}</span>
            <div class='blur-wrapper'>
                <div class='bg-blur'></div>
            </div>
            <div class='btn-bg'></div>
        </A>
    )
}
