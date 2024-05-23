import { Component, createSignal, onMount } from 'solid-js'

import './style/navbar.scss'

import { ArrowDownIcon, FaqIcon } from 'icons/home'
import { HomeIcon, ProductsIcon, SupportIcon } from 'icons/navbar'
import logo from 'static/imgs/logo.png'

import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import spotifyImg from 'static/imgs/spotify.png'
import youtubeImg from 'static/imgs/youtube.png'

const Navbar: Component = props => {
    const [dropdown, setDropdown] = createSignal(false)

    let bigNav: HTMLElement

    let navLinks: NodeListOf<HTMLElement>
    let line: HTMLElement

    onMount(() => {
        bigNav = document.querySelector<HTMLElement>('nav.nav-big-container')

        navLinks = document.querySelectorAll('a.nav-link')
        line = document.querySelector('.line#nav')

        document.addEventListener('scroll', () => {
            if (scrollY >= 200) {
                if (!bigNav.classList.contains('active')) {
                    bigNav.className += ' active'
                }
            } else {
                bigNav.className = 'nav-big-container'
            }
        })

        navLinks.forEach((link: HTMLElement, index) => {
            link.addEventListener('mouseenter', () => {
                let left = link.offsetLeft

                console.log(left)

                line.style.left = `calc(${left}px + 1.${index * 2}em)`
                line.style.width = `${link.getBoundingClientRect().width / 1.5}px`
            })
        })
    })
    return (
        <>
            <nav class='nav-big-container'>
                <div
                    class='nav-links'
                    onmouseenter={() => {
                        if (!line.classList.contains('show')) {
                            line.className += ' show'
                        }
                    }}
                    onMouseLeave={() => {
                        line.className = 'line title_small'
                    }}
                >
                    <a class='nav-link title_small'>
                        <HomeIcon />
                        خانه
                    </a>
                    <a
                        class='nav-link title_small'
                        onmouseenter={() => setDropdown(true)}
                        onmouseleave={() => setDropdown(false)}
                    >
                        <ProductsIcon />
                        محصولات
                        <ArrowDownIcon class='drop' />
                        <DropDown show={dropdown()} />
                    </a>
                    <a class='nav-link title_small'>
                        <SupportIcon />
                        ارتباط با ما
                    </a>
                    <a class='nav-link title_small'>
                        <FaqIcon />
                        سوالات متداول
                    </a>
                    <div class='line title_small' id='nav'></div>
                </div>
                <img class='nav-logo' src={logo} alt='' />
            </nav>
        </>
    )
}

interface dropdownProps {
    show: boolean
}

const DropDown: Component<dropdownProps> = P => {
    return (
        <div class='dropdown' classList={{ active: P.show }}>
            <div class='drop-link title_smaller'>
                <div class='holder icon'>
                    <img src={discordImg} alt='' />
                </div>
                <div class='data'>دیسکورد</div>
            </div>
            <div class='drop-link title_smaller'>
                <div class='holder icon'>
                    <img src={spotifyImg} alt='' />
                </div>
                <div class='data'>اسپاتیفای</div>
            </div>
            <div class='drop-link title_smaller'>
                <div class='holder icon'>
                    <img src={CanvaImg} alt='' />
                </div>
                <div class='data'>کانوا</div>
            </div>
            <div class='drop-link title_smaller'>
                <div class='holder icon'>
                    <img src={youtubeImg} alt='' />
                </div>
                <div class='data'>یوتیوب</div>
            </div>
            <div class='drop-link title_smaller'>
                <div class='holder icon'>
                    <img src={appleMusicImg} alt='' />
                </div>
                <div class='data'>اپل موزیک</div>
            </div>
        </div>
    )
}

export default Navbar
