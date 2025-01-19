import { ShotingStarFlipIcon, ShotingStarIcon } from 'icons/home'
import { Component } from 'solid-js'

import './style/hero.scss'

export const Hero: Component = () => {
    return (
        <section class='hero-container' id='hero'>
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
                    <ShotingStarFlipIcon />
                    <img
                        src='/static/image/logo/apple-music.png'
                        class='star-img'
                        alt=''
                    />
                </div>
                <div class='star discord'>
                    <ShotingStarIcon />
                    <img
                        src='/static/image/logo/discord.png'
                        class='star-img'
                        alt=''
                    />
                </div>
                <div class='star spotify'>
                    <ShotingStarFlipIcon />
                    <img
                        src='/static/image/logo/spotify.png'
                        class='star-img'
                        alt=''
                    />
                </div>
                <div class='star netflix'>
                    <ShotingStarIcon />
                    <img
                        src='/static/image/logo/netflix.png'
                        class='star-img'
                        alt=''
                    />
                </div>
            </div>
        </section>
    )
}
