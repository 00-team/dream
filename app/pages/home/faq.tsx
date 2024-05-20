import { FaqIcon } from 'icons/home'
import { Component, onMount } from 'solid-js'

import './style/faq.scss'

const Faq: Component = props => {
    let container: HTMLElement
    let header: HTMLElement
    let icons: NodeListOf<HTMLElement>

    onMount(() => {
        header = document.querySelector('.faq-header')
        icons = document.querySelectorAll('.header-icon')

        var observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    let transform = Math.floor(entry.intersectionRatio * 50)

                    icons.forEach((elem: HTMLElement) => {
                        elem.style.transform = `translateY(${-(-50 + transform)}px)`
                    })
                }
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            }
        )

        observer.observe(header)
    })

    return (
        <section class='faq-container'>
            <header class='faq-header'>
                <div class='header-icon'>
                    <FaqIcon size={50} />
                </div>
                <h3 class='section_title'>سوالات متداول</h3>
                <div class='header-icon reverse'>
                    <FaqIcon class='reverse' size={50} />
                </div>
            </header>
            <div class='faq-wrapper'></div>
        </section>
    )
}

export default Faq
