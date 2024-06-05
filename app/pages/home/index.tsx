import { Application } from '@splinetool/runtime'
import { showNav } from 'state/nav'
import { About } from './about'
import Contact from './contact'
import { Customers } from './customers'
import Faq from './faq'
import { Services } from './services'

import { onMount } from 'solid-js'
import './style/home.scss'

const Home = () => {
    let canvas: HTMLCanvasElement

    onMount(() => {
        canvas = document.querySelector('canvas#hero-canvas')

        const app = new Application(canvas)
        app.load('https://prod.spline.design/qWr8woUD83wEXS33/scene.splinecode')
    })

    return (
        <main class='home' classList={{ 'show-small': showNav() }}>
            <section class='hero-container' id='hero'>
                <canvas id='hero-canvas'></canvas>
            </section>

            <About />
            <Services />
            <Customers />
            <Faq />
            <Contact />
        </main>
    )
}

export default Home
