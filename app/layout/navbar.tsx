import { Component, onMount } from 'solid-js'

import './style/navbar.scss'

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
                <div class='nav-links'></div>
                <img class='nav-logo' src={logo} alt='' />
            </nav>
        </>
    )
}
export default Navbar
