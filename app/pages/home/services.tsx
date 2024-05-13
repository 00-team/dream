import { Component, onMount } from 'solid-js'

import './style/services.scss'

export const Services: Component = props => {
    let headerContainer: HTMLElement
    let secHeader1: HTMLElement
    let secHeader2: HTMLElement

    onMount(() => {
        secHeader1 = document.querySelector<HTMLElement>(
            'span.services-head#right'
        )
        secHeader2 = document.querySelector<HTMLElement>(
            'span.services-head#left'
        )
        headerContainer = document.querySelector<HTMLElement>(
            'h3.section_title#services_header'
        )

        window.onscroll = () => {
            let top = headerContainer.getBoundingClientRect().top - innerHeight

            console.log(top / 10)
            if (top <= 0) {
                secHeader1.style.transform = `translateX(${Math.max(50 + top / 10, -2.5)}vw)`

                secHeader2.style.transform = `translateX(${Math.min(-(50 + top / 10), 2.5)}vw)`
            }
        }
    })

    return (
        <section class='services-container'>
            <header class='section-header'>
                <h3 class='section_title' id='services_header'>
                    <span class='services-head' id='right'>
                        بهترین هارو
                    </span>
                    <span class='services-head' id='left'>
                        با ما تجربه کن
                    </span>
                </h3>
            </header>
        </section>
    )
}
