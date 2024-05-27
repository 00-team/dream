import { Component } from 'solid-js'

import './style/products.scss'

import discordbanner from 'static/imgs/banners/discord.jpg'
import spotifybanner from 'static/imgs/banners/spotify.png'
import tradingviewbanner from 'static/imgs/banners/tradingview.jpg'

const Products: Component = props => {
    return (
        <main class='products'>
            <header class='products-header'></header>
            <div class='products-wrapper'>
                <ProductCard img={discordbanner} />
                <ProductCard img={spotifybanner} />
                <ProductCard img={tradingviewbanner} />
            </div>
        </main>
    )
}

interface ProductCardProps {
    img: string
    // title:string
}
const ProductCard: Component<ProductCardProps> = P => {
    return (
        <div class='product-card'>
            <div class='img-wrapper'>
                <img src={P.img} class='card-img' alt='' />
            </div>
        </div>
    )
}

export default Products
