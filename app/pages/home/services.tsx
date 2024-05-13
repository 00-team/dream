import { Component, JSX, onMount } from 'solid-js'

import './style/services.scss'

import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import psnImg from 'static/imgs/psn.jpg'
import spotifyImg from 'static/imgs/spotify.png'
import xboxImg from 'static/imgs/xbox.jpg'
import youtubeImg from 'static/imgs/youtube.png'

export const Services: Component = props => {
    let headerContainer: HTMLElement
    let secHeader1: HTMLElement
    let secHeader2: HTMLElement

    let icons: NodeListOf<HTMLElement>

    function headerAnim() {
        let top = headerContainer.getBoundingClientRect().top - innerHeight

        if (top <= 0) {
            secHeader1.style.transform = `translateX(${Math.max(50 + top / 10, -2.5)}vw)`

            secHeader2.style.transform = `translateX(${Math.min(-(50 + top / 10), 2.5)}vw)`
        }
    }

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

        icons = document.querySelectorAll('.icon-container')

        window.onscroll = () => {
            headerAnim()

            let top =
                headerContainer.getBoundingClientRect().top - innerHeight / 4
            if (top >= 0 && top <= 500) {
                let transform = top

                icons.forEach((elem: HTMLElement, index) => {
                    elem.style.transform = `translateY(${transform / 5}px)`
                })
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
            <div class='icons-container'>
                <ServiceIcon link='/#' img={CanvaImg} />
                <ServiceIcon link='/#' img={discordImg} />

                <ServiceIcon link='/#' img={xboxImg} />
                <ServiceIcon link='/#' img={spotifyImg} />
                <ServiceIcon link='/#' img={psnImg} />
                <ServiceIcon link='/#' img={youtubeImg} />
                <ServiceIcon link='/#' img={appleMusicImg} />
            </div>
        </section>
    )
}

interface ServiceIconProps {
    img: string
    style?: JSX.CSSProperties
    link: string
}

const ServiceIcon: Component<ServiceIconProps> = P => {
    let serviceSection: HTMLElement

    onMount(() => {
        serviceSection = document.querySelector<HTMLElement>(
            'section.services-container'
        )
    })

    return (
        <a href={P.link} class='icon-container' style={{ ...P.style }}>
            <div class='icon-wrapper'>
                <img
                    src={P.img}
                    alt=''
                    draggable={false}
                    loading='lazy'
                    decoding='async'
                />
                <div
                    class='reflect'
                    style={{ 'background-image': `url(${P.img})` }}
                ></div>
            </div>
        </a>
    )
}
