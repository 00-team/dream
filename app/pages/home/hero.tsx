import { ShotingStarFlipIcon, ShotingStarIcon } from 'icons/home'
import { Component, onCleanup, onMount } from 'solid-js'

import './style/hero.scss'

const MaxPerspective = 1001
const MaxTransform = innerWidth > 768 ? innerWidth / 2 : innerWidth

export const Hero: Component = () => {
    let ref: HTMLElement
    let root: HTMLElement
    let stars: NodeListOf<HTMLElement>
    let container: HTMLElement

    onMount(() => {
        if (!ref || !container) return

        root = document.querySelector('body')
        stars = document.querySelectorAll('.stars-container .star')

        if (!root || !stars) return

        document.addEventListener('scroll', abc)

        onCleanup(() => {
            document.removeEventListener('scroll', abc)
        })
    })

    function abc(e: Event) {
        const scrollTop = scrollY // The current scroll position
        const containerRect = container.getBoundingClientRect() // The total scrollable height
        const clientHeight = root.clientHeight // The height of the viewport

        const percentage = Math.min(
            100,
            Math.max(
                0,
                ((containerRect.height - containerRect.bottom) /
                    containerRect.height) *
                    100 *
                    0.7
            )
        )

        if (percentage > 50) {
            container.className = 'hero-container disable'
        } else {
            container.className = 'hero-container'
        }

        ref.style.transform = `translate3d(0, -${Math.min(MaxPerspective, percentage * 0.8)}px
        ,${Math.min(MaxPerspective, percentage * 25)}px) `

        let transform = Math.min(MaxTransform, percentage * 10)

        stars.forEach((el: HTMLElement, index) => {
            if (index % 2 === 0) {
                el.style.transform = `translateX(${transform}px) translateY(-${transform}px)`
            } else {
                el.style.transform = `translateX(-${transform}px) translateY(-${transform}px)`
            }
        })
    }

    return (
        <section class='hero-container' id='hero' ref={e => (container = e)}>
            <div class='hero-wrapper'>
                <div class='hero-texts section_title' ref={e => (ref = e)}>
                    <div>
                        {/* <span>D</span>
                    <span>R</span>
                    <span>E</span>
                    <span>A</span>
                    <span>M</span> */}
                        <svg width={260} height={130}>
                            <path
                                id='head-curve'
                                class='curve'
                                d='M 0 120 C 0 120, 130 0, 260 120'
                            ></path>
                            <text class='text' text-anchor='middle'>
                                <textPath
                                    class='text-path'
                                    href='#head-curve'
                                    startOffset={'50%'}
                                >
                                    DREAM
                                </textPath>
                            </text>
                        </svg>
                    </div>
                    <div>
                        <svg width='260' height='130'>
                            <path
                                id='buttom-curve'
                                class='curve'
                                d='M 0 120 C 0 120, 130 0, 260 120'
                            ></path>
                            <text class='text' text-anchor='middle'>
                                <textPath
                                    class='text-path'
                                    href='#buttom-curve'
                                    startOffset='50.5%'
                                >
                                    PAY
                                </textPath>
                            </text>
                        </svg>
                    </div>
                </div>

                <div class='stars-container'>
                    <div class='star applemusic'>
                        <div class='star-wrapper'>
                            <ShotingStarFlipIcon />
                            <img
                                src='/static/image/logo/apple-music.webp'
                                class='star-img'
                                alt=''
                                onclick={() => open('products?kind=applemusic')}
                            />
                        </div>
                    </div>

                    <div class='star discord'>
                        <div class='star-wrapper'>
                            <ShotingStarIcon />
                            <img
                                src='/static/image/logo/discord.webp'
                                class='star-img'
                                alt=''
                                onclick={() => open('products?kind=discord')}
                            />
                        </div>
                    </div>

                    <div class='star spotify'>
                        <div class='star-wrapper'>
                            <ShotingStarFlipIcon />
                            <img
                                src='/static/image/logo/spotify.webp'
                                class='star-img'
                                alt=''
                                onclick={() => open('products?kind=spotify')}
                            />
                        </div>
                    </div>

                    <div class='star netflix'>
                        <div class='star-wrapper'>
                            <ShotingStarIcon />
                            <img
                                src='/static/image/logo/netflix.webp'
                                class='star-img'
                                alt=''
                                onclick={() => open('products?kind=netflix')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
