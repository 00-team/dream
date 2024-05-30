import { showNav } from 'state/nav'
import { About } from './about'
import Contact from './contact'
import { Customers } from './customers'
import Faq from './faq'
import { Services } from './services'

import './style/home.scss'

const Home = () => {
    return (
        <main class='home' classList={{ 'show-small': showNav() }}>
            <section class='hero-container' id='hero'>
                <iframe src='https://my.spline.design/dreampay-0a78cdac709ee611db084ccb679701db/'></iframe>
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
