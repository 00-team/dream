import { Select, Special } from 'comps'
import { CheckIcon, CrossIcon } from 'icons/home'
import { SupportIcon } from 'icons/navbar'
import { CreditCardIcon, TimerIcon } from 'icons/products'
import { DiscountModel, ProductModel } from 'models'
import {
    Component,
    createEffect,
    createMemo,
    onCleanup,
    onMount,
    Show,
} from 'solid-js'

import { useNavigate } from '@solidjs/router'
import { httpx } from 'shared'
import { createStore, produce } from 'solid-js/store'
import { self, setSelf } from 'store/self'
import './style/popup.scss'

type Props = {
    open: boolean
    onClose(): void
    product: ProductModel
    kind: string
}

export const ProductPopup: Component<Props> = P => {
    let particles: HTMLElement
    type State = {
        selected_plan: string | null
        data: { [k: string]: string }
        discount: DiscountModel | null
        discount_code: string | null
        discount_error: string
    }
    const [state, setState] = createStore<State>({
        selected_plan: null,
        data: {},
        discount: null,
        discount_code: null,
        discount_error: '',
    })
    const nav = useNavigate()

    onMount(() => {
        particles = document.getElementById('particles-js')
    })

    createEffect(() => {
        if (P.open) {
            setState({
                discount_code: null,
                discount: null,
                discount_error: '',
            })
            // @ts-ignore
            particlesJS('particles-js', particle_conf(P.product.logo))
        } else {
            particles.childNodes.forEach(e => e.remove())
        }
    })

    onCleanup(() => {
        if (!particles) return
        particles.childNodes.forEach(e => e.remove())
    })

    const plans = createMemo(() =>
        Object.entries(P.product.plans)
            .map(([k, v], i) => ({
                idx: i,
                display: v[1],
                key: k,
            }))
            .sort((a, b) => (a.display < b.display ? -1 : 1))
    )

    const price = createMemo(() => {
        let plan = P.product.plans[state.selected_plan]
        if (!plan) return 0

        if (
            state.discount &&
            (!state.discount.plan || state.discount.plan == state.selected_plan)
        ) {
            return ~~((plan[0] / 100) * (100 - state.discount.amount))
        }

        return plan[0]
    })

    createEffect(() => {
        if (plans().length == 0) {
            setState({ selected_plan: null })
            return
        }

        if (plans().length == 1) {
            setState({ selected_plan: plans()[0].key })
        }
    })

    function buy() {
        if (!self.loged_in) {
            nav('/login/')
            return
        }

        if (self.user.wallet < price()) {
            nav('/dashboard/wallet/')
            return
        }

        httpx({
            url: '/api/orders/',
            method: 'POST',
            json: {
                kind: P.kind,
                plan: state.selected_plan,
                data: state.data,
                discount: state.discount_code,
            },
            onLoad(x) {
                if (x.status == 200) {
                    setSelf({ fetch: true })
                    nav('/dashboard/orders/')
                    return
                }
            },
        })
    }

    function discount_check(code: string) {
        httpx({
            url: `/api/orders/discount/${code}/`,
            method: 'GET',
            // show_messages: false,
            onLoad(x) {
                if (x.status != 200) {
                    setState({
                        discount_error:
                            x.response.content || x.response.subject,
                        discount: null,
                        discount_code: code,
                    })
                    return
                }

                let discount: DiscountModel = x.response

                if (discount.kind && P.kind != discount.kind) {
                    setState({
                        discount_error: 'این کد برای این محصول نمی باشد',
                        discount: null,
                        discount_code: code,
                    })
                    return
                }

                setState({
                    discount_error: '',
                    discount,
                    discount_code: discount.code,
                })
            },
        })
    }

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
                        <span>
                            {P.product.name}
                            {/*<Show
                                when={state.selected_plan}
                                fallback={P.product.name}
                            >
                                {P.product.plans[state.selected_plan][1]}
                            </Show>*/}
                        </span>
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

                    <Show when={plans().length > 1}>
                        <div class='selector'>
                            <span class='title_smaller'>
                                پلن مدنظر خود را انتخاب کنید:
                            </span>
                            <Select
                                items={plans()}
                                onChange={v =>
                                    setState({ selected_plan: v[0].key })
                                }
                            />
                        </div>
                    </Show>

                    <div
                        class='discount'
                        classList={{ error: !!state.discount_error }}
                    >
                        <label for='discount_input'>کد تخفیف:</label>
                        <input
                            dir='ltr'
                            id='discount_input'
                            placeholder='e.g.: dream'
                            maxLength={255}
                            value={state.discount_code}
                            onChange={e => {
                                let value = e.currentTarget.value
                                if (!value) {
                                    setState({
                                        discount: null,
                                        discount_error: '',
                                        discount_code: '',
                                    })
                                    return
                                }
                                discount_check(value)
                            }}
                        />
                        <Show when={state.discount_error}>
                            <span></span>
                            <span class='err'>{state.discount_error}</span>
                        </Show>
                    </div>

                    <div class='input-data'>
                        {P.product.data
                            .filter(d => d != 'detail')
                            .map((d, i) => (
                                <div class='g'>
                                    <label
                                        for={`input-data-${d}${i}`}
                                        class='title_small'
                                    >
                                        {d}:
                                    </label>
                                    <input
                                        id={`input-data-${d}${i}`}
                                        placeholder={d}
                                        class='title_smaller'
                                        onInput={e => {
                                            setState(
                                                produce(s => {
                                                    s.data[d] =
                                                        e.currentTarget.value
                                                })
                                            )
                                        }}
                                    />
                                </div>
                            ))}
                        <textarea
                            dir='auto'
                            placeholder='توضیحات'
                            class='title_smaller'
                            rows={2}
                            onInput={e => {
                                setState(
                                    produce(s => {
                                        s.data['detail'] = e.currentTarget.value
                                    })
                                )
                            }}
                        ></textarea>
                    </div>

                    <Show when={state.selected_plan}>
                        <div class='buy-cta title_small'>
                            <span class='number price'>
                                <span>
                                    {(~~(price() / 10)).toLocaleString()} تومان
                                </span>
                            </span>
                            <Special
                                text={
                                    !self.loged_in
                                        ? 'ورود'
                                        : self.user.wallet < price()
                                          ? 'شارژ کیف پول'
                                          : 'خرید'
                                }
                                onclick={buy}
                            />
                        </div>
                    </Show>
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
