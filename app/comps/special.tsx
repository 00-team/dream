import { Component } from 'solid-js'

import './style/special.scss'

interface SpecialProps {
    text: string
    class?: string
    link?: string
}

export const Special: Component<SpecialProps> = P => {
    return (
        <a
            href={P.link ? P.link : ''}
            class={`special title_smaller ${P.class || ''}`}
        >
            <span>{P.text}</span>
            <div class='blur-wrapper'>
                <div class='bg-blur'></div>
            </div>
            <div class='btn-bg'></div>
        </a>
    )
}
