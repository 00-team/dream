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
            <div class='icons-container'>
                <ServiceIcon link='/#' delay={0} img={CanvaImg} />
                <ServiceIcon link='/#' delay={2.6} img={discordImg} />

                <ServiceIcon link='/#' delay={4.2} img={xboxImg} />
                <ServiceIcon link='/#' delay={5.5} img={spotifyImg} />
                <ServiceIcon link='/#' delay={3.9} img={psnImg} />
                <ServiceIcon link='/#' delay={1.3} img={youtubeImg} />
                <ServiceIcon link='/#' delay={1.3} img={appleMusicImg} />
            </div>
        </section>
    )
}

interface ServiceIconProps {
    img: string
    delay: number
    style?: JSX.CSSProperties
    link: string
}

const ServiceIcon: Component<ServiceIconProps> = P => {
    return (
        <a
            href={P.link}
            class='icon-container'
            style={{ 'animation-delay': `${P.delay}s`, ...P.style }}
        >
            <div class='icon-wrapper'>
                <img src={P.img} alt='' />
                <div
                    class='reflect'
                    style={{ 'background-image': `url(${P.img})` }}
                ></div>
            </div>
        </a>
    )
}
