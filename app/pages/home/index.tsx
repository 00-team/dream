import { Component } from 'solid-js'

import './style/home.scss'

const Home: Component<{}> = props => {
    return (
        <main class='home'>
            <section class='hero-container'>
                <iframe src='https://my.spline.design/dreampay-0a78cdac709ee611db084ccb679701db/'></iframe>
            </section>
            <section class='about-us'>
                <div class='header-texts'>
                    <h3 class='section_title'>چرا</h3>
                    <h2 class='section_title logo'>
                        <span>Dream</span>

                        <span>Pay</span>
                    </h2>
                </div>
                <div class='card left'></div>
                <div class='card right'></div>
            </section>
        </main>
    )
}

export default Home
