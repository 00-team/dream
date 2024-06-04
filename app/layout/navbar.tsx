import { Component, createEffect, createSignal, onMount } from 'solid-js'

import './style/navbar.scss'

import logo from 'assets/image/logo.png'
import { ArrowDownIcon, CrossIcon, FaqIcon } from 'icons/home'
import {
    AboutIcon,
    HomeIcon,
    MenuIcon,
    ProductsIcon,
    SupportIcon,
} from 'icons/navbar'

import { setshowNav, showNav } from 'state/nav'
// import appleMusicImg from 'static/imgs/apple-music.png'
// import CanvaImg from 'static/imgs/canva.png'
// import discordImg from 'static/imgs/discord.png'
// import spotifyImg from 'static/imgs/spotify.png'
// import youtubeImg from 'static/imgs/youtube.png'
import { A } from '@solidjs/router'
import { DashboardIcon, LoginIcon } from 'icons/login'
import { self } from 'store/self'
import { setTheme, theme } from 'store/theme'

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
            <NavSvg />

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
                <ThemeSwitch />

                <img
                    loading='lazy'
                    decoding='async'
                    draggable={false}
                    class='nav-logo'
                    src={logo}
                    alt=''
                />

                <A class='nav-link title_small' href='/'>
                    <HomeIcon />
                    خانه
                </A>
                <A
                    class='nav-link title_small'
                    href='/products'
                    onmouseenter={() => setDropdown(true)}
                    onmouseleave={() => setDropdown(false)}
                >
                    <ProductsIcon />
                    محصولات
                    <ArrowDownIcon class='drop' />
                    <DropDownBig show={dropdown()} />
                </A>
                <A class='nav-link title_small' href='/#about'>
                    <AboutIcon />
                    درباره ما
                </A>
                <A class='nav-link title_small' href='/#contact'>
                    <SupportIcon />
                    ارتباط با ما
                </A>
                <A class='nav-link title_small' href='/#faq'>
                    <FaqIcon />
                    سوالات متداول
                </A>
                <div class='line title_small' id='nav'></div>
            </div>
            {self.loged_in ? (
                <A href='/dashboard' class='title_small nav-cta'>
                    <DashboardIcon />
                    داشبورد
                </A>
            ) : (
                <A href='/login' class='title_small nav-cta'>
                    <LoginIcon />
                    ورود
                </A>
            )}
        </nav>
    )
}

const SmallNav: Component = () => {
    const [showdrop, setshowDrop] = createSignal(false)

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
                <img
                    loading='lazy'
                    decoding='async'
                    draggable={false}
                    class='nav-logo'
                    src={logo}
                    alt=''
                />
            </nav>
            <div class='show-small-nav' classList={{ active: showNav() }}>
                <div class='nav-wrapper'>
                    <ThemeSwitch />

                    {self.loged_in ? (
                        <A href='/dashboard' class='title_small nav-link'>
                            <DashboardIcon />
                            داشبورد
                        </A>
                    ) : (
                        <A href='/login' class='title_small nav-link'>
                            <LoginIcon />
                            ورود
                        </A>
                    )}
                    <A class='nav-link title_small' href='/'>
                        <HomeIcon />
                        خانه
                    </A>
                    <div
                        class='nav-link title_small'
                        onclick={() => setshowDrop(s => !s)}
                    >
                        <ProductsIcon />
                        محصولات
                        <ArrowDownIcon class='drop' />
                        <DropDownSmall
                            show={showdrop()}
                            onclick={() => {
                                setshowDrop(false)
                                setshowNav(false)
                            }}
                        />
                    </div>
                    <A class='nav-link title_small' href='/#about'>
                        <AboutIcon />
                        درباره ما
                    </A>
                    <A class='nav-link title_small' href='/#contact'>
                        <SupportIcon />
                        ارتباط با ما
                    </A>
                    <A class='nav-link title_small' href='/#faq'>
                        <FaqIcon />
                        سوالات متداول
                    </A>
                </div>
            </div>
        </>
    )
}

const NavSvg: Component = () => {
    return (
        <svg
            id='svg'
            viewBox='0 0 1440 325'
            xmlns='http://www.w3.org/2000/svg'
            class='transition duration-300 ease-in-out delay-150 nav-svg'
        >
            <defs>
                <linearGradient
                    id='gradient'
                    x1='0%'
                    y1='50%'
                    x2='100%'
                    y2='50%'
                >
                    <stop offset='50%' stop-color='#3fd3ff'></stop>
                    <stop offset='95%' stop-color='#ff6eff'></stop>
                </linearGradient>
            </defs>
            <path
                d='M 0,400 L 0,100 C 101.96428571428572,87.53571428571428 203.92857142857144,75.07142857142857 327,67 C 450.07142857142856,58.92857142857143 594.2499999999999,55.249999999999986 714,66 C 833.7500000000001,76.75000000000001 929.0714285714287,101.92857142857143 1046,110 C 1162.9285714285713,118.07142857142857 1301.4642857142858,109.03571428571428 1440,100 L 1440,400 L 0,400 Z'
                stroke='none'
                stroke-width='0'
                fill='url(#gradient)'
                fill-opacity='0.53'
                class='transition-all duration-300 ease-in-out delay-150 path-0'
                transform='rotate(-180 720 200)'
            ></path>
            <defs>
                <linearGradient
                    id='gradient'
                    x1='0%'
                    y1='50%'
                    x2='100%'
                    y2='50%'
                >
                    <stop offset='5%' stop-color='#3fd3ff'></stop>
                    <stop offset='95%' stop-color='#ff6eff'></stop>
                </linearGradient>
            </defs>
            <path
                d='M 0,400 L 0,233 C 96,215.82142857142856 192,198.64285714285714 331,208 C 470,217.35714285714286 651.9999999999999,253.25 778,263 C 904.0000000000001,272.75 974,256.3571428571429 1075,247 C 1176,237.6428571428571 1308,235.32142857142856 1440,233 L 1440,400 L 0,400 Z'
                stroke='none'
                stroke-width='0'
                fill='url(#gradient)'
                fill-opacity='1'
                class='transition-all duration-300 ease-in-out delay-150 path-1'
                transform='rotate(-180 720 200)'
            ></path>
        </svg>
    )
}

interface dropdownProps {
    show: boolean
    onclick?: () => void
}

const DropDownBig: Component<dropdownProps> = P => {
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
                    <img src={'/static/image/logo/discord.png'} alt='' />
                </div>
                <div class='data'>دیسکورد</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.2s' }}>
                    <img src={'/static/image/logo/spotify.png'} alt='' />
                </div>
                <div class='data'>اسپاتیفای</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.3s' }}>
                    <img src={'/static/image/logo/canva.png'} alt='' />
                </div>
                <div class='data'>کانوا</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.4s' }}>
                    <img src={'/static/image/logo/youtube.png'} alt='' />
                </div>
                <div class='data'>یوتیوب</div>
            </a>
            <a class='drop-link title_smaller'>
                <div class='holder icon' style={{ 'transition-delay': '0.5s' }}>
                    <img src={'/static/image/logo/apple-music.png'} alt='' />
                </div>
                <div class='data'>اپل موزیک</div>
            </a>
        </div>
    )
}

const DropDownSmall: Component<dropdownProps> = P => {
    return (
        <div class='small-dropdown' classList={{ active: P.show }}>
            <a
                href='/products'
                class='small-link title_smaller'
                onclick={P.onclick}
            >
                <div class='holder icon' style={{ 'transition-delay': '0.1s' }}>
                    <img src={'/static/image/logo/discord.png'} alt='' />
                </div>
                <div class='data'>دیسکورد</div>
            </a>
            <a href='/products' class='small-link title_smaller'>
                <div
                    class='holder icon'
                    style={{ 'transition-delay': '0.2s' }}
                    onclick={P.onclick}
                >
                    <img src={'/static/image/logo/spotify.png'} alt='' />
                </div>
                <div class='data'>اسپاتیفای</div>
            </a>
            <a href='/products' class='small-link title_smaller'>
                <div
                    class='holder icon'
                    style={{ 'transition-delay': '0.3s' }}
                    onclick={P.onclick}
                >
                    <img src={'/static/image/logo/canva.png'} alt='' />
                </div>
                <div class='data'>کانوا</div>
            </a>
            <a href='/products' class='small-link title_smaller'>
                <div
                    class='holder icon'
                    style={{ 'transition-delay': '0.4s' }}
                    onclick={P.onclick}
                >
                    <img src={'/static/image/logo/youtube.png'} alt='' />
                </div>
                <div class='data'>یوتیوب</div>
            </a>
            <a href='/products' class='small-link title_smaller'>
                <div
                    class='holder icon'
                    style={{ 'transition-delay': '0.5s' }}
                    onclick={P.onclick}
                >
                    <img src={'/static/image/logo/apple-music.png'} alt='' />
                </div>
                <div class='data'>اپل موزیک</div>
            </a>
        </div>
    )
}

const ThemeSwitch = P => {
    let themeswitch: HTMLElement

    onMount(() => {
        themeswitch = document.querySelector('.theme-switch')

        themeswitch.addEventListener('change', switchTheme)
    })

    function switchTheme(e) {
        if (e.target.checked) {
            setTheme('dark')
        } else {
            setTheme('light')
        }
    }

    return (
        <div class='theme-switch' classList={{ dark: theme() === 'dark' }}>
            <label for='theme-btn'>
                <input type='checkbox' id='theme-btn' />
                <div class='slider-wrapper'>
                    <div class='theme-btn-slider'></div>
                    <span class='star star-1'></span>
                    <span class='star star-2'></span>
                    <span class='star star-3'></span>
                    <span class='star star-4'></span>
                    <span class='star star-5'></span>
                    <span class='star star-6'></span>
                </div>
            </label>
        </div>
    )
}

export default Navbar
