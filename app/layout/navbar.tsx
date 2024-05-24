import { Component, createEffect, createSignal, onMount } from 'solid-js'

import './style/navbar.scss'

import { ArrowDownIcon, CrossIcon, FaqIcon } from 'icons/home'
import { HomeIcon, MenuIcon, ProductsIcon, SupportIcon } from 'icons/navbar'
import logo from 'static/imgs/logo.png'

import { setshowNav, showNav } from 'state/nav'
import appleMusicImg from 'static/imgs/apple-music.png'
import CanvaImg from 'static/imgs/canva.png'
import discordImg from 'static/imgs/discord.png'
import spotifyImg from 'static/imgs/spotify.png'
import youtubeImg from 'static/imgs/youtube.png'

const Navbar: Component = props => {
    return (
        <>
            <BigNav />

            <SmallNav />
        </>
    )
}

const BigNav: Component = () => {
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

                line.style.left = `calc(${left}px + 1.${index * 2}em)`
                line.style.width = `${link.getBoundingClientRect().width / 1.5}px`
            })
        })
    })
    return (
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
                <a class='nav-link title_small' href='/'>
                    <HomeIcon />
                    خانه
                </a>
                <a
                    class='nav-link title_small'
                    href='/products'
                    onmouseenter={() => setDropdown(true)}
                    onmouseleave={() => setDropdown(false)}
                >
                    <ProductsIcon />
                    محصولات
                    <ArrowDownIcon class='drop' />
                    <DropDown show={dropdown()} />
                </a>
                <a class='nav-link title_small' href='/#contact'>
                    <SupportIcon />
                    ارتباط با ما
                </a>
                <a class='nav-link title_small' href='/#faq'>
                    <FaqIcon />
                    سوالات متداول
                </a>
                <div class='line title_small' id='nav'></div>
            </div>
            <img class='nav-logo' src={logo} alt='' />
        </nav>
    )
}

const SmallNav: Component = () => {
    let mainElem: HTMLElement

    onMount(() => {
        mainElem = document.querySelector('main')

        console.log(mainElem)
    })

    return (
        <>
            <nav class='nav-small-container'>
                <button
                    onclick={() => {
                        setshowNav(s => !s)
                    }}
                    class='open-small'
                    classList={{ active: showNav() }}
                >
                    <div class='open'>
                        <MenuIcon size={30} />
                    </div>
                    <div class='close'>
                        <CrossIcon size={30} />
                    </div>
                </button>
                <img class='nav-logo' src={logo} alt='' />
            </nav>
            <div class='show-small-nav' classList={{ active: showNav() }}>
                <a class='nav-link title_small' href='/'>
                    <HomeIcon />
                    خانه
                </a>
                <a class='nav-link title_small' href='/products'>
                    <ProductsIcon />
                    محصولات
                    <ArrowDownIcon class='drop' />
                    <div class='dropdown'></div>
                </a>
                <a class='nav-link title_small' href='/#contact'>
                    <SupportIcon />
                    ارتباط با ما
                </a>
                <a class='nav-link title_small' href='/#faq'>
                    <FaqIcon />
                    سوالات متداول
                </a>
            </div>
        </>
    )
}

interface dropdownProps {
    show: boolean
}

const DropDown: Component<dropdownProps> = P => {
    let links: NodeListOf<HTMLElement>

    createEffect(() => {
        links = document.querySelectorAll('.drop-link')

        let height = links[0].getBoundingClientRect().height

        if (P.show) {
            links.forEach((link: HTMLElement, index) => {
                if (index === 0) return

                link.style.top = `${height * index - 3}px`
                link.style.zIndex = `${100 - index}`
            })
        } else {
            links.forEach((link: HTMLElement, index) => {
                if (index === 0) return

                link.style.top = `0px`
                link.style.zIndex = `${0}`
            })
        }
    })
    return (
        <div class='dropdown' classList={{ active: P.show }}>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.1s' }}>
                    <img src={discordImg} alt='' />
                </div>
                <div class='data'>دیسکورد</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.2s' }}>
                    <img src={spotifyImg} alt='' />
                </div>
                <div class='data'>اسپاتیفای</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.3s' }}>
                    <img src={CanvaImg} alt='' />
                </div>
                <div class='data'>کانوا</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.4s' }}>
                    <img src={youtubeImg} alt='' />
                </div>
                <div class='data'>یوتیوب</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.5s' }}>
                    <img src={appleMusicImg} alt='' />
                </div>
                <div class='data'>اپل موزیک</div>
            </a>
        </div>
    )
}

export default Navbar
