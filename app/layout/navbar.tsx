import { Component, onMount } from 'solid-js'

import './style/navbar.scss'

import { FaqIcon } from 'icons/home'
import { HomeIcon, ProductsIcon, SupportIcon } from 'icons/navbar'
import logo from 'static/imgs/logo.png'

const Navbar: Component = props => {
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

        navLinks.forEach((link: HTMLElement) => {
            link.addEventListener('mouseenter', () => {
                let left = link.offsetLeft

                console.log(left)

                line.style.left = `calc(${left}px + 1em)`
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
                    <div class='line title_small' id='nav'></div>
                </div>
                <img class='nav-logo' src={logo} alt='' />
            </nav>
        </>
    )
}
export default Navbar
