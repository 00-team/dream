import { Component, onMount } from 'solid-js'

import './style/products.scss'

import { Special } from 'components'
import { CheckIcon } from 'icons/home'
import { SupportIcon } from 'icons/navbar'
import { CreditCardIcon, TimerIcon } from 'icons/products'
import { popup, setpopup } from 'state/products'
import applemusicbanner from 'static/imgs/banners/applemusic.jpg'
import canvabanner from 'static/imgs/banners/canva.png'
import discordbanner from 'static/imgs/banners/discord.jpg'
import psnbanner from 'static/imgs/banners/psn.webp'
import spotifybanner from 'static/imgs/banners/spotify.png'
import tradingviewbanner from 'static/imgs/banners/tradingview.jpg'
import xboxbanner from 'static/imgs/banners/xbox.jpg'
import youtubebanner from 'static/imgs/banners/youtube.png'

import applemusic from 'static/imgs/apple-music.png'
import canva from 'static/imgs/canva.png'
import discord from 'static/imgs/discord.png'
import google from 'static/imgs/google.png'
import grammerly from 'static/imgs/grammerly.png'
import hbo from 'static/imgs/hbo.png'
import netflix from 'static/imgs/netflix.jpg'
import prime from 'static/imgs/prime.png'
import psn from 'static/imgs/psn.jpg'
import spotify from 'static/imgs/spotify.png'
import tradingview from 'static/imgs/tradingview.png'
import xbox from 'static/imgs/xbox.jpg'
import youtube from 'static/imgs/youtube.png'

const Products: Component = props => {
    let cards: NodeListOf<HTMLElement>
    let cardsWrapper: HTMLElement

    onMount(() => {
        cardsWrapper = document.querySelector('.products-wrapper')
        cards = document.querySelectorAll('.product-card')

        cards.forEach((card: HTMLElement) => {
            card.addEventListener('mouseenter', () => {
                cardsWrapper.childNodes.forEach((card_id: HTMLElement) => {
                    if (card_id !== card) {
                        card_id.className += ' fadeout'
                    }
                })
            })
            card.addEventListener('mouseleave', () => {
                cardsWrapper.childNodes.forEach((card_id: HTMLElement) => {
                    if (card_id !== card) {
                        card_id.className = card_id.className.replace(
                            ' fadeout',
                            ''
                        )
                    }
                })
            })

            card.onmousemove = e => {
                const rect = card.getBoundingClientRect()

                let x = e.clientX - rect.left
                let y = e.clientY - rect.top

                card.style.setProperty('--mouse-x', `${x}px`)
                card.style.setProperty('--mouse-y', `${y}px`)
            }
        })
    })

    return (
        <main class='products'>
            <header class='products-header'></header>
            <div class='products-wrapper'>
                <ProductCard
                    product='discord'
                    title='دیسکورد'
                    img={discordbanner}
                />
                <ProductCard
                    product='spotify'
                    title='اسپاتیفای'
                    img={spotifybanner}
                />
                <ProductCard
                    product='tradingview'
                    title='تریدینگ ویو'
                    img={tradingviewbanner}
                />
                <ProductCard product='canva' title='کانوا' img={canvabanner} />
                <ProductCard
                    product='applemusic'
                    title='اپل موزیک'
                    img={applemusicbanner}
                />
                <ProductCard
                    product='youtube'
                    title='یوتیوب'
                    img={youtubebanner}
                />
                <ProductCard product='xbox' title='گیم پس' img={xboxbanner} />
                <ProductCard product='psn' title='پی اس ان' img={psnbanner} />
            </div>
            <ProductPopUp />
        </main>
    )
}

interface ProductCardProps {
    img: string
    title: string
    product: string
}

const options = [
    'تضمین اصل بودن',
    'تحویل فوری',
    'درگاه معتبر',
    'پشتیبانی 24 ساعت',
]

const imgs = {
    xbox: xbox,
    applemusic: applemusic,
    canva: canva,
    discord: discord,
    psn: psn,
    spotify: spotify,
    tradingview: tradingview,
    youtube: youtube,
    netflix: netflix,
    google: google,
    grammerly: grammerly,
    hbo: hbo,
    prime: prime,
}

const ProductCard: Component<ProductCardProps> = P => {
    return (
        <figure class={`product-card ${P.product || ''}`}>
            <div class='img-wrapper'>
                <img src={P.img} class='card-img' alt='' />
            </div>
            <div class='card-title title_small'>
                <span>{P.title}</span>
            </div>

            <div class='product-options'>
                {options.map((text, index) => {
                    if (index >= 3) return
                    return (
                        <div class='product-option description'>
                            <CheckIcon />
                            {text}
                        </div>
                    )
                })}
            </div>

            <button
                class='card-buy title_smaller'
                onclick={() =>
                    setpopup({
                        show: true,
                        title: P.title,
                        category: P.product,
                        img: imgs[P.product],
                    })
                }
            >
                خرید
            </button>
        </figure>
    )
}

interface ProductPopUpProps {}

const ProductPopUp: Component<ProductPopUpProps> = P => {
    onMount(() => {
        // @ts-ignore
        particlesJS(
            'particles-js',

            {
                particles: {
                    number: {
                        value: 80,
                        density: {
                            enable: true,
                            value_area: 800,
                        },
                    },
                    color: {
                        value: '#2a78bd',
                    },
                    shape: {
                        type: 'circle',
                        stroke: {
                            width: 0,
                            color: '#2a78bd',
                        },
                        polygon: {
                            nb_sides: 5,
                        },
                        image: {
                            src: tradingview,
                            width: 100,
                            height: 100,
                        },
                    },
                    opacity: {
                        value: 0.5,
                        random: false,
                        anim: {
                            enable: false,
                            speed: 1,
                            opacity_min: 0.1,
                            sync: false,
                        },
                    },
                    size: {
                        value: 5,
                        random: true,
                        anim: {
                            enable: false,
                            speed: 40,
                            size_min: 0.1,
                            sync: false,
                        },
                    },
                    line_linked: {
                        enable: true,
                        distance: 150,
                        color: '#2a78bd',
                        opacity: 0.4,
                        width: 1,
                    },
                    move: {
                        enable: true,
                        speed: 6,
                        direction: 'none',
                        random: false,
                        straight: false,
                        out_mode: 'out',
                        attract: {
                            enable: false,
                            rotateX: 600,
                            rotateY: 1200,
                        },
                    },
                },
                interactivity: {
                    detect_on: 'canvas',
                    events: {
                        onhover: {
                            enable: true,
                            mode: 'repulse',
                        },
                        onclick: {
                            enable: true,
                            mode: 'push',
                        },
                        resize: true,
                    },
                    modes: {
                        grab: {
                            distance: 400,
                            line_linked: {
                                opacity: 1,
                            },
                        },
                        bubble: {
                            distance: 400,
                            size: 40,
                            duration: 2,
                            opacity: 8,
                            speed: 3,
                        },
                        repulse: {
                            distance: 200,
                        },
                        push: {
                            particles_nb: 4,
                        },
                        remove: {
                            particles_nb: 2,
                        },
                    },
                },
                retina_detect: true,
                config_demo: {
                    hide_card: false,
                    background_color: '#b61924',
                    background_image: '',
                    background_position: '50% 50%',
                    background_repeat: 'no-repeat',
                    background_size: 'cover',
                },
            }
        )
    })

    return (
        <div class='product-popup' classList={{ active: popup.show }}>
            <div
                class='close-popup'
                onclick={() => setpopup({ show: false })}
            ></div>
            <div class={`popup-wrapper ${popup.category || ''}`}>
                <aside class='popup-data'>
                    <h2 class='item-title title'>
                        <span>{popup.title}</span>
                    </h2>
                    <div class='items-options'>
                        <div class='option title_small'>
                            <CheckIcon />
                            تضمین اصل بودن
                        </div>
                        <div class='option title_small'>
                            <TimerIcon />
                            تحویل فوری
                        </div>
                        <div class='option title_small'>
                            <CreditCardIcon />
                            درگاه معتبر
                        </div>
                        <div class='option title_small'>
                            <SupportIcon />
                            پشتیبانی 24 ساعت
                        </div>
                    </div>
                    <div class='plan'></div>
                    <div class='buy-cta title_small'>
                        <span class='number price'>
                            <span>121,000</span>
                        </span>
                        <Special text='خرید' />
                    </div>
                </aside>
                <aside class='popup-img'>
                    {/* <img src={popup.img} alt='' /> */}
                    <div
                        id='particles-js'
                        class='particles-js'
                        style={{ width: '100%', height: '100%' }}
                    ></div>
                </aside>
            </div>
        </div>
    )
}

export default Products
