import { Component, JSX, onMount } from 'solid-js'

import './style/services.scss'

import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import googleImg from 'static/imgs/google.png'
import grammerlyImg from 'static/imgs/grammerly.png'
import HBOImg from 'static/imgs/hbo.png'
import netflixImg from 'static/imgs/netflix.jpg'
import primeImg from 'static/imgs/prime.png'
import psnImg from 'static/imgs/psn.jpg'
import spotifyImg from 'static/imgs/spotify.png'
import xboxImg from 'static/imgs/xbox.jpg'
import youtubeImg from 'static/imgs/youtube.png'

import { PlusIcon } from 'icons/home'
import discordBanner from 'static/imgs/banners/discord.jpg'
import spotifyBanner from 'static/imgs/banners/spotify.png'
import tradingviewBanner from 'static/imgs/banners/tradingview.jpg'

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

        serviceRows = document.querySelectorAll('.services-item-row')
        itemsBg = document.querySelector<HTMLElement>('.items-bg')
        servicesItems = document.querySelector<HTMLElement>('.services-items')

        icons = document.querySelectorAll('.icon-container')

        let lastScrollPosition = scrollY
        let rowScale = 0.5
        let rowRotate = 45

        window.onscroll = () => {
            headerAnim()

            IconsAnim()

            if (itemsBg.classList.contains('active')) return

            let top = servicesWrapper.getBoundingClientRect().top

            if (top <= 0) {
                let currentScrollPosition = scrollY

                if (currentScrollPosition > lastScrollPosition) {
                    if (rowScale < 1) {
                        rowScale = rowScale + 0.005
                    }

                    if (rowRotate > 0) {
                        rowRotate = rowRotate - 0.5
                    }
                } else if (currentScrollPosition < lastScrollPosition) {
                    if (rowScale > 0.5) {
                        rowScale = rowScale - 0.005
                    }

                    if (rowRotate < 45) {
                        rowRotate = rowRotate + 0.5
                    }
                }

                serviceRows.forEach((elem: HTMLElement) => {
                    elem.style.transform = `scale(${Math.min(rowScale, 1)}) rotate3d(1, 1, 1, ${rowRotate}deg)`
                })

                lastScrollPosition = currentScrollPosition

                if (rowScale >= 1) {
                    itemsBg.className += ' active'
                    servicesItems.className += ' active'
                }

                if (innerWidth <= 768 && rowScale >= 1) {
                    servicesWrapper.style.minHeight = '100vh'
                    servicesWrapper.style.height = 'auto'

                    section.style.minHeight = '200vh'
                    section.style.height = 'auto'
                }
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
            <div class='services-items'>
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
            <div class='items-bg'>
                <div class='services-item-row section_title'>
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
                <div class='services-item-row section_title reverse'>
                    <div class='row google'>
                        <img src={googleImg} alt='' />
                        <span>Google One</span>
                    </div>

                    <div class='row prime'>
                        <img src={primeImg} alt='' />
                        <span>Prime Gaming</span>
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
                <div class='services-item-row section_title'>
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
