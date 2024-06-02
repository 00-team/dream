import { Select, Special } from 'comps'
import { CheckIcon, CrossIcon } from 'icons/home'
import { SupportIcon } from 'icons/navbar'
import { CreditCardIcon, TimerIcon } from 'icons/products'
import { ProductModel } from 'models'
import { Component, createEffect, onCleanup, onMount } from 'solid-js'

import './style/popup.scss'

type Props = {
    open: boolean
    onClose(): void
    product: ProductModel
}

export const ProductPopup: Component<Props> = P => {
    let particles: HTMLElement

    onMount(() => {
        particles = document.getElementById('particles-js')
    })

    createEffect(() => {
        if (P.open) {
            // @ts-ignore
            particlesJS('particles-js', particle_conf(P.product.logo))
        } else {
            particles.childNodes.forEach(e => e.remove())
        }
    })

    onCleanup(() => {
        particles.childNodes.forEach(e => e.remove())
    })

    return (
        <div
            class='product-popup'
            classList={{ active: P.open }}
            style={{ '--color': P.product.color }}
        >
            <div class='close-popup' onclick={() => P.onClose()}></div>
            <div class='popup-wrapper'>
                <button class='close' onClick={P.onClose}>
                    <CrossIcon size={30} />
                </button>
                <aside class='popup-data'>
                    <h2 class='item-title title'>
                        <span>{P.product.name}</span>
                    </h2>
                    <div class='items-options'>
                        <div class='option title_smaller'>
                            <CheckIcon />
                            تضمین اصل بودن
                        </div>
                        <div class='option title_smaller'>
                            <TimerIcon />
                            تحویل فوری
                        </div>
                        <div class='option title_smaller'>
                            <CreditCardIcon />
                            درگاه معتبر
                        </div>
                        <div class='option title_smaller'>
                            <SupportIcon />
                            پشتیبانی 24 ساعت
                        </div>
                    </div>

                    <div class='selector'>
                        <div class='g'>
                            <span>select time</span>
                            <Select
                                items={[
                                    { idx: 0, display: 'hi' },
                                    { idx: 1, display: 'hh' },
                                ]}
                                onChange={v => console.log(v)}
                            />
                        </div>
                        <div class='g'>
                            <span>select type</span>
                            <Select
                                items={[
                                    { idx: 0, display: 'hi' },
                                    { idx: 1, display: 'hh' },
                                ]}
                                onChange={v => console.log(v)}
                            />
                        </div>
                    </div>

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

function particle_conf(image: string) {
    return {
        particles: {
            number: {
                value: 70,
                density: {
                    enable: true,
                    value_area: 800,
                },
            },
            color: {
                value: '#2a78bd',
            },
            shape: {
                // type: 'circle',
                // stroke: {
                //     width: 0,
                //     color: '#2a78bd',
                // },
                // polygon: {
                //     nb_sides: 5,
                // },
                // image: {
                //     src: discord,
                //     width: 100,
                //     height: 100,
                // },
                type: 'image',
                image: {
                    src: image,
                    width: 5000,
                    height: 5000,
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
                value: 50,
                random: true,
                anim: {
                    enable: false,
                    speed: 40,
                    size_min: 0.1,
                    sync: false,
                },
            },
            line_linked: {
                enable: false,
                distance: 150,
                color: '#2a78bd',
                opacity: 0.4,
                width: 1,
            },
            move: {
                enable: true,
                speed: 3,
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
                    distance: 100,
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
}
