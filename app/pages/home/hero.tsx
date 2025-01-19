import { ShotingStarFlipIcon, ShotingStarIcon } from 'icons/home'
import { Component, onCleanup, onMount } from 'solid-js'

import './style/hero.scss'

const MaxPerspective = 1001

export const Hero: Component = () => {
    let ref: HTMLElement
    let root: HTMLElement

    onMount(() => {
        if (!ref) return

        root = document.querySelector('body')

        if (!root) return

        document.addEventListener('scroll', abc)

        onCleanup(() => {
            document.removeEventListener('scroll', abc)
        })
    })

    function abc(e: Event) {
        const scrollTop = scrollY // The current scroll position
        const scrollHeight = root.scrollHeight // The total scrollable height
        const clientHeight = root.clientHeight // The height of the viewport

        // Calculate the percentage of scroll
        const percentage = Math.floor(
            (scrollTop / (scrollHeight - clientHeight)) * 100
        )

        ref.style.transform = `translateZ(100px)`
        console.log(percentage)
    }

    return (
        <section class='hero-container' id='hero'>
            <div class='hero-wrapper' ref={e => (ref = e)}>
                <div class='hero-texts section_title'>
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
                                    startOffset='50%'
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
                                src='/static/image/logo/apple-music.png'
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
                                src='/static/image/logo/discord.png'
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
                                src='/static/image/logo/spotify.png'
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
                                src='/static/image/logo/netflix.png'
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
