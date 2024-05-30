import {
    Component,
    createEffect,
    createSignal,
    onCleanup,
    onMount,
} from 'solid-js'

import './style/products.scss'

import { Special } from 'comps'
import { ArrowDownIcon, CheckIcon, CrossIcon } from 'icons/home'
import { SupportIcon } from 'icons/navbar'
import { CreditCardIcon, TimerIcon } from 'icons/products'
import { popup, setpopup } from 'state/products'
import { createStore } from 'solid-js/store'
import { Product } from 'models'
import { hex_to_rgb, httpx } from 'shared'

const Products: Component = () => {
    type State = {
        products: { [k: string]: [Product, ...Product[]] }
    }
    const [state, setState] = createStore<State>({ products: {} })

    onMount(() => {
        httpx({
            url: '/api/products/',
            method: 'GET',
            onLoad(x) {
                if (x.status != 200) return

                let products: State['products'] = {}
                let result = x.response as Product[]
                result.forEach(p => {
                    let [item] = p.kind.split('.')
                    if (item in products) {
                        products[item].push(p)
                    } else {
                        products[item] = [p]
                    }
                })

                setState({ products })
            },
        })
    })

    let products_wrapper: HTMLDivElement
    createEffect(() => {
        // cardsWrapper = document.querySelector('.products-wrapper')
        // cards = document.querySelectorAll('.product-card')
        //
        let cards =
            products_wrapper.querySelectorAll<HTMLDivElement>('.product-card')

        // cards.forEach((card: HTMLElement) => {
        //     card.addEventListener('mouseenter', () => {
        //         products_wrapper.childNodes.forEach((card_id: HTMLElement) => {
        //             if (card_id !== card) {
        //                 card_id.className += ' fadeout'
        //             }
        //         })
        //     })
        //     card.addEventListener('mouseleave', () => {
        //         cardsWrapper.childNodes.forEach((card_id: HTMLElement) => {
        //             if (card_id !== card) {
        //                 card_id.className = card_id.className.replace(
        //                     ' fadeout',
        //                     ''
        //                 )
        //             }
        //         })
        //     })
        //
        //     card.onmousemove = e => {

        //     }
        // })
    })

    return (
        <main class='products'>
            <header class='products-header'></header>
            <div class='products-wrapper' ref={products_wrapper}>
                {Object.entries(state.products).map(([k, v]) => (
                    <ProductCard product={v} item={k} />
                ))}
            </div>
            <ProductPopUp />
        </main>
    )
}

const options = [
    'تضمین اصل بودن',
    'تحویل فوری',
    'درگاه معتبر',
    'پشتیبانی 24 ساعت',
]

interface ProductCardProps {
    item: string
    product: [Product, ...Product[]]
}
const ProductCard: Component<ProductCardProps> = P => {
    return (
        <figure
            class='product-card'
            onMouseMove={e => {
                let el = e.currentTarget
                const rect = el.getBoundingClientRect()

                let x = e.clientX - rect.left
                let y = e.clientY - rect.top

                el.style.setProperty('--mouse-x', `${x}px`)
                el.style.setProperty('--mouse-y', `${y}px`)
            }}
            style={{ '--color': hex_to_rgb(P.product[0].color) }}
        >
            <div class='img-wrapper'>
                <img src={P.product[0].image} class='card-img' alt='' />
            </div>
            <div class='card-title title_small'>
                <span>{P.product[0].name}</span>
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
                        title: P.product[0].name,
                        category: P.item,
                        img: P.product[0].logo,
                        color: P.product[0].color,
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
    let particles: HTMLElement

    onMount(() => {
        particles = document.getElementById('particles-js')
    })

    createEffect(() => {
        if (popup.show) {
            // @ts-ignore
            particlesJS(
                'particles-js',

                {
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
                                src: popup.img,
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
            )
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
            classList={{ active: popup.show }}
            style={{ '--color': popup.color }}
        >
            <div
                class='close-popup'
                onclick={() => setpopup({ show: false })}
            ></div>
            <div class={`popup-wrapper ${popup.category || ''}`}>
                <button class='close' onclick={() => setpopup({ show: false })}>
                    <CrossIcon size={30} />
                </button>
                <aside class='popup-data'>
                    <h2 class='item-title title'>
                        <span>{popup.title}</span>
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

                    <ProductPlan />

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

const ProductPlan: Component = P => {
    const [showdrop, setshowdrop] = createSignal(false)

    return (
        <div
            class='plan'
            onmouseenter={() => innerWidth > 1024 && setshowdrop(true)}
            onmouseleave={() => innerWidth > 1024 && setshowdrop(false)}
            onclick={() => innerWidth <= 1024 && setshowdrop(s => !s)}
            classList={{ active: showdrop() }}
        >
            <button class='selected title_small'>
                <div class='holder'>لورم ایپسوم</div>
                <div class='arrow'>
                    <ArrowDownIcon />
                </div>
            </button>
            <div class='plan-options'>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
                <div class='plan-option title_smaller'>لورم ایپسوم</div>
            </div>
        </div>
    )
}

export default Products
