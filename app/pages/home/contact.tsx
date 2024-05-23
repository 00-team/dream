import { Component, onMount } from 'solid-js'

import './style/contact.scss'

const Contact: Component = props => {
    let header: HTMLElement
    let subheader: HTMLElement

    onMount(() => {
        header = document.querySelector('h4#contact-header')
        subheader = document.querySelector('h5#contact-subheader')

        document.addEventListener('scroll', () => {
            let top = header.getBoundingClientRect().top - innerHeight

            if (top <= 0) {
                let val = Math.min(-top * 0.5, 450)

                header.style.backgroundImage = `linear-gradient(
                    90deg,
                    transparent ${100 - (val - 10)}%,
                    #000000 140%
                )`
                subheader.style.backgroundImage = `linear-gradient(
                    90deg,
                    transparent ${100 - (val - 10)}%,
                    #000000 140%
                )`
            }
        })
    })

    return (
        <section class='contact'>
            <header class='contact-header'>
                <h4 class='section_title' id='contact-header'>
                    جواب سوالتو پیدا نکردی؟
                </h4>
                <h5 class='title_small subheader' id='contact-subheader'>
                    باما در ارتباط باش!
                </h5>
            </header>
            <div class='contact-wrapper'></div>
        </section>
    )
}

export default Contact
