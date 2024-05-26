import { Component, JSX, onMount } from 'solid-js'

import './style/services.scss'

import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import psnImg from 'static/imgs/psn.jpg'
import spotifyImg from 'static/imgs/spotify.png'
import xboxImg from 'static/imgs/xbox.jpg'
import youtubeImg from 'static/imgs/youtube.png'

import { PlusIcon } from 'icons/home'
import discordBanner from 'static/imgs/banners/discord.jpg'
import spotifyBanner from 'static/imgs/banners/spotify.png'
import tradingviewBanner from 'static/imgs/banners/tradingview.jpg'

import logo from 'static/imgs/logo.png'

export const Services: Component = props => {
    let section: HTMLElement

    let headerContainer: HTMLElement
    let secHeader1: HTMLElement
    let secHeader2: HTMLElement

    let servicesWrapper: HTMLElement
    let servicesItems: HTMLElement
    let serviceRows: NodeListOf<HTMLElement>
    let itemsBg: HTMLElement

    let icons: NodeListOf<HTMLElement>

    function headerAnim() {
        let top = headerContainer.getBoundingClientRect().top - innerHeight

        if (top <= 0) {
            secHeader1.style.transform = `translateX(${Math.max(50 + top / 10, -2.5)}vw)`

            secHeader2.style.transform = `translateX(${Math.min(-(50 + top / 10), 2.5)}vw)`
        }
    }

    function IconsAnim() {
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

    onMount(() => {
        section = document.querySelector<HTMLElement>(
            'section.services-container'
        )

        secHeader1 = document.querySelector<HTMLElement>(
            'span.services-head#right'
        )
        secHeader2 = document.querySelector<HTMLElement>(
            'span.services-head#left'
        )
        headerContainer = document.querySelector<HTMLElement>(
            'h3.section_title#services_header'
        )

        servicesWrapper =
            document.querySelector<HTMLElement>('.services-wrapper')

        icons = document.querySelectorAll('.icon-container')

        let lastScrollPosition = scrollY
        let rowScale = 0.5
        let rowRotate = 45

        window.onscroll = () => {
            headerAnim()

            IconsAnim()
        }
    })

    return (
        <section class='services-container' id='products'>
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

            <div class='services-bubble' id='bubble-one'>
                <div class='dot'></div>
                <img src={logo} class='bubble-logo' alt='' />
            </div>
            <div class='services-bubble' id='bubble-two'>
                <div class='dot'></div>
                <img src={logo} class='bubble-logo' alt='' />
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

const ServicesWrapper: Component = () => {
    return (
        <div class='services-wrapper'>
            <div
                class='services-items'
                classList={{ active: innerWidth <= 768 }}
            >
                <h4 class='title_hero'>اماده ای؟ بزن بریم</h4>
                <h5 class='title'>پرفروش ترین هامون</h5>

                <div class='items-wrapper'>
                    <div class='item-service'>
                        <img src={discordBanner} alt='' />

                        <p class='title item-title'>
                            <span>Discord Nitro</span>
                        </p>

                        <div class='item-details title_smaller'>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تضمین اصل بودن
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تحویل سریع{' '}
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                پشتیبانی 24 ساعته
                            </p>
                        </div>

                        <a href='#about' class='cta title_smaller'>
                            <span>برو بریم</span>
                        </a>
                    </div>
                    <div class='item-service main'>
                        <img src={spotifyBanner} alt='' />

                        <p class='title item-title'>
                            <span>Spotify</span>
                        </p>

                        <div class='item-details title_smaller'>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تضمین اصل بودن
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تحویل سریع{' '}
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                پشتیبانی 24 ساعته
                            </p>
                        </div>

                        <a href='#about' class='cta title_smaller special'>
                            <span>برو بریم</span>
                            <div class='blur-wrapper'>
                                <div class='bg-blur'></div>
                            </div>
                            <div class='btn-bg'></div>
                        </a>
                    </div>
                    <div class='item-service'>
                        <img src={tradingviewBanner} alt='' />

                        <p class='title item-title'>
                            <span>TradingView</span>
                        </p>

                        <div class='item-details title_smaller'>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تضمین اصل بودن
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                تحویل سریع{' '}
                            </p>
                            <p class='item-detail'>
                                <PlusIcon size={15} />
                                پشتیبانی 24 ساعته
                            </p>
                        </div>

                        <a href='#about' class='cta title_smaller'>
                            <span>برو بریم</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
