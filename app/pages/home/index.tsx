import { Component } from 'solid-js'
import { About } from './about'
import { Customers } from './customers'
import Faq from './faq'
import { Services } from './services'

import './style/home.scss'

const Home: Component<{}> = props => {
    return (
        <main class='home'>
            <section class='hero-container' id='hero'>
                <iframe src='https://my.spline.design/dreampay-0a78cdac709ee611db084ccb679701db/'></iframe>
            </section>

            <About />

            <Services />

            <Customers />

            <Faq />
        </main>
    )
}

export default Home
