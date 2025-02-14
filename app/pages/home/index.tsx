import { Application } from '@splinetool/runtime'
import { showNav } from 'state/nav'
import { About } from './about'
import Contact from './contact'
import { Customers } from './customers'
import Faq from './faq'
import { Services } from './services'

import { onMount } from 'solid-js'
import './style/home.scss'
import { Hero } from './hero'

const Home = () => {
    // let canvas: HTMLCanvasElement

    // onMount(() => {
    //     const app = new Application(canvas)
    //     app.load('/static/spline/hero.splinecode')
    // })

    return (
        <main class='home' classList={{ 'show-small': showNav() }}>
            <Hero />

            <About />

            <Services />

            <Customers />

            <Faq />

            <Contact />
        </main>
    )
}

export default Home
