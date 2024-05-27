import { Component } from 'solid-js'

import './style/products.scss'

import discordbanner from 'static/imgs/banners/discord.jpg'
import spotifybanner from 'static/imgs/banners/spotify.png'
import tradingviewbanner from 'static/imgs/banners/tradingview.jpg'
import { CheckIcon } from 'icons/home'

const Products: Component = props => {
    return (
        <main class='products'>
            <header class='products-header'></header>
            <div class='products-wrapper'>
                <ProductCard title='دیسکورد' img={discordbanner} />
                <ProductCard title='اسپاتیفای' img={spotifybanner} />
                <ProductCard title='تریدینگ ویو' img={tradingviewbanner} />
            </div>
        </main>
    )
}

interface ProductCardProps {
    img: string
    title: string
}

const options = ['تضمین اصل بودن', 'تحویل فوری']

const ProductCard: Component<ProductCardProps> = P => {
    return (
        <figure class='product-card'>
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
