import { Component, createEffect, onMount } from 'solid-js'

import './style/products.scss'

import { CheckIcon } from 'icons/home'
import { ProductModel } from 'models'
import { hex_to_rgb, httpx } from 'shared'
import { createStore } from 'solid-js/store'
import { ProductPopup } from './popup'
import { useNavigate, useParams, useSearchParams } from '@solidjs/router'

const DEFP: ProductModel = {
    name: '',
    logo: '',
    data: [],
    color: '',
    image: '',
    plans: {},
}

export default () => {
    type State = {
        products: { [k: string]: ProductModel }
        popup: string | null
    }
    const [state, setState] = createStore<State>({
        products: {},
        popup: null,
    })
    const [params, setParams] = useSearchParams()

    createEffect(() => {
        let kind = params.kind
        if (!kind) return
        if (!(kind in state.products)) return
        setState({ popup: kind })
    })

    onMount(() => {
        httpx({
            url: '/api/products/',
            method: 'GET',
            onLoad(x) {
                if (x.status != 200) return
                setState({ products: x.response })
            },
        })
    })

    // let products_wrapper: HTMLDivElement
    // createEffect(() => {
    //     // cardsWrapper = document.querySelector('.products-wrapper')
    //     // cards = document.querySelectorAll('.product-card')
    //     //
    //     let cards =
    //         products_wrapper.querySelectorAll<HTMLDivElement>('.product-card')
    //
    //
    //     // cards.forEach((card: HTMLElement) => {
    //     //     card.addEventListener('mouseenter', () => {
    //     //         products_wrapper.childNodes.forEach((card_id: HTMLElement) => {
    //     //             if (card_id !== card) {
    //     //                 card_id.className += ' fadeout'
    //     //             }
    //     //         })
    //     //     })
    //     //     card.addEventListener('mouseleave', () => {
    //     //         cardsWrapper.childNodes.forEach((card_id: HTMLElement) => {
    //     //             if (card_id !== card) {
    //     //                 card_id.className = card_id.className.replace(
    //     //                     ' fadeout',
    //     //                     ''
    //     //                 )
    //     //             }
    //     //         })
    //     //     })
    //     //
    //     // })
    // })

    return (
        <main class='products'>
            <header class='products-header'></header>
            <div class='products-wrapper'>
                {Object.entries(state.products).map(([k, v]) => (
                    <ProductCard
                        product={v}
                        item={k}
                        onPopup={() => {
                            setState({ popup: k })
                            setParams({ kind: k })
                        }}
                    />
                ))}
            </div>
            <ProductPopup
                onClose={() => {
                    setState({ popup: null })
                    setParams({ kind: null })
                }}
                open={state.popup != null}
                product={state.products[state.popup] || DEFP}
                kind={state.popup}
            />
        </main>
    )
}

let plans = {
    '1': 'یک ماهه',
    '2': 'دو ماهه',
    '3': 'سه ماهه',
    '6': 'شیش ماهه',
    '12': 'یک ساله',
    '24': 'دو ساله',
}

const options = [
    'تضمین اصل بودن',
    'تحویل فوری',
    'درگاه معتبر',
    'پشتیبانی 24 ساعت',
]

interface ProductCardProps {
    item: string
    product: ProductModel
    onPopup(): void
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
            style={{ '--color': hex_to_rgb(P.product.color) }}
        >
            <div class='img-wrapper'>
                <img
                    loading='lazy'
                    decoding='async'
                    draggable={false}
                    src={P.product.image}
                    class='card-img'
                    alt=''
                />
            </div>
            <div class='card-title title_small'>
                <span>{P.product.name}</span>
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

            <button class='card-buy title_smaller' onClick={P.onPopup}>
                خرید
            </button>
        </figure>
    )
}
