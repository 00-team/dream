import { Component, onMount } from 'solid-js'

import './style/products.scss'

import { CheckIcon } from 'icons/home'
import { popup, setpopup } from 'state/products'
import applemusicbanner from 'static/imgs/banners/applemusic.jpg'
import canvabanner from 'static/imgs/banners/canva.png'
import discordbanner from 'static/imgs/banners/discord.jpg'
import psnbanner from 'static/imgs/banners/psn.webp'
import spotifybanner from 'static/imgs/banners/spotify.png'
import tradingviewbanner from 'static/imgs/banners/tradingview.jpg'
import xboxbanner from 'static/imgs/banners/xbox.jpg'
import youtubebanner from 'static/imgs/banners/youtube.png'

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

const options = ['تضمین اصل بودن', 'تحویل فوری', 'درگاه معتبر']

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

            <button
                class='card-buy title_smaller'
                onclick={() =>
                    setpopup({
                        show: true,
                        title: P.title,
                        category: P.product,
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
    return (
        <div class='product-popup' classList={{ active: popup.show }}>
            <div
                class='close-popup'
                onclick={() => setpopup({ show: false })}
            ></div>
            <div class='popup-wrapper'>
                <aside class='popup-img'>
                    <img src={popup.img} alt='' />
                </aside>
                <aside class='popup-data'>
                    <h2 class='item-title title'>
                        <span>{popup.title}</span>
                    </h2>
                </aside>
            </div>
        </div>
    )
}

export default Products
