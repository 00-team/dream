import { Component, onMount } from 'solid-js'

import './style/navbar.scss'

import { FaqIcon } from 'icons/home'
import { HomeIcon, ProductsIcon, SupportIcon } from 'icons/navbar'
import logo from 'static/imgs/logo.png'

const Navbar: Component = props => {
    let bigNav: HTMLElement

    onMount(() => {
        bigNav = document.querySelector<HTMLElement>('nav.nav-big-container')

        document.addEventListener('scroll', () => {
            if (scrollY >= 200) {
                if (!bigNav.classList.contains('active')) {
                    bigNav.className += ' active'
                }
            } else {
                bigNav.className = 'nav-big-container'
            }
        })
    })
    return (
        <>
            <nav class='nav-big-container'>
                <div class='nav-links'>
                    <a class='nav-link title_small'>
                        <HomeIcon />
                        خانه
                    </a>
                    <a class='nav-link title_small'>
                        <ProductsIcon />
                        محوصلات
                    </a>
                    <a class='nav-link title_small'>
                        <SupportIcon />
                        ارتباط با ما
                    </a>
                    <a class='nav-link title_small'>
                        <FaqIcon />
                        سوالات متداول
                    </a>
                    <div class='line'></div>
                </div>
                <img class='nav-logo' src={logo} alt='' />
            </nav>
        </>
    )
}
export default Navbar
