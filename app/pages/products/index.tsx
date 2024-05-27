import { Component, onMount } from 'solid-js'

import './style/products.scss'

import { CheckIcon } from 'icons/home'
import discordbanner from 'static/imgs/banners/discord.jpg'
import spotifybanner from 'static/imgs/banners/spotify.png'
import tradingviewbanner from 'static/imgs/banners/tradingview.jpg'

const Products: Component = props => {
    let cards: NodeListOf<HTMLElement>

    onMount(() => {
        cards = document.querySelectorAll('.product-card')

        cards.forEach((card: HTMLElement) => {
            card.onmousemove = e => {
                const { currentTarget: target } = e

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
            </div>
        </main>
    )
}

interface ProductCardProps {
    img: string
    title: string
    product: string
}

const options = ['تضمین اصل بودن', 'تحویل فوری']

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
                {options.map(text => {
                    return (
                        <div class='product-option description'>
                            <CheckIcon />
                            {text}
                        </div>
                    )
                })}
            </div>

            <button class='card-buy title_smaller'>خرید</button>
        </figure>
    )
}

export default Products
