import { Component, JSX, onMount } from 'solid-js'

import './style/services.scss'

import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import psnImg from 'static/imgs/psn.jpg'
import spotifyImg from 'static/imgs/spotify.png'
import xboxImg from 'static/imgs/xbox.jpg'
import youtubeImg from 'static/imgs/youtube.png'
import HBOImg from 'static/imgs/hbo.png'
import googleImg from 'static/imgs/google.png'
import grammerlyImg from 'static/imgs/grammerly.png'
import netflixImg from 'static/imgs/netflix.jpg'
import primeImg from 'static/imgs/prime.png'

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
                headerContainer.getBoundingClientRect().top - innerHeight / 3.5

            if (top >= 0 && top <= 500) {
                let transform = top

                icons.forEach((elem: HTMLElement, index) => {
                    elem.style.transform = `translateY(${Math.max(transform, 0)}px)`

                    if (index === 0 || index === 6) {
                        return (elem.style.transitionDelay = '0.15s')
                    }
                    if (index === 1 || index === 5) {
                        return (elem.style.transitionDelay = '0.1s')
                    }
                    if (index === 2 || index === 4) {
                        return (elem.style.transitionDelay = '0.05s')
                    }
                    return (elem.style.transitionDelay = '0.0s')
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

            <ServicesWrapper />
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

const ServicesWrapper: Component = () => {
    return (
        <div class='services-wrapper'>
            <div class='services-items'></div>
            <div class='items-bg'>
                <div class='item-row section_title'>
                    <div class='row apple'>
                        <img src={appleMusicImg} alt='' />
                        <span>Apple Music</span>
                    </div>
                    <div class='row psn'>
                        <img src={psnImg} alt='' />
                        <span>PSN</span>
                    </div>
                    <div class='row xbox'>
                        <img src={xboxImg} alt='' />
                        <span>Xbox</span>
                    </div>
                    <div class='row canva'>
                        <img src={CanvaImg} alt='' />
                        <span>Canva</span>
                    </div>
                    <div class='row discord'>
                        <img src={discordImg} alt='' />
                        <span>Discord Nitro</span>
                    </div>
                </div>
                <div class='item-row section_title reverse'>
                    <div class='row prime'>
                        <img src={primeImg} alt='' />
                        <span>Prime Gaming</span>
                    </div>

                    <div class='row google'>
                        <img src={googleImg} alt='' />
                        <span>Google One</span>
                    </div>
                    <div class='row grammerly'>
                        <img src={grammerlyImg} alt='' />
                        <span>Grammerly</span>
                    </div>
                    <div class='row netflix'>
                        <img src={netflixImg} alt='' />
                        <span>Netflix</span>
                    </div>
                    <div class='row hbo'>
                        <img src={HBOImg} alt='' />
                        <span>Hbo Max</span>
                    </div>
                </div>
                <div class='item-row section_title'>
                    <div class='row apple'>
                        <img src={appleMusicImg} alt='' />
                        <span>Apple Music</span>
                    </div>
                    <div class='row psn'>
                        <img src={psnImg} alt='' />
                        <span>PSN</span>
                    </div>
                    <div class='row xbox'>
                        <img src={xboxImg} alt='' />
                        <span>Xbox</span>
                    </div>
                    <div class='row canva'>
                        <img src={CanvaImg} alt='' />
                        <span>Canva</span>
                    </div>
                    <div class='row discord'>
                        <img src={discordImg} alt='' />
                        <span>Discord Nitro</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
