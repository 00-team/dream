import { Component, onMount } from 'solid-js'

import './style/home.scss'

const Home: Component<{}> = props => {
    return (
        <main class='home'>
            <section class='hero-container'>
                <iframe src='https://my.spline.design/dreampay-0a78cdac709ee611db084ccb679701db/'></iframe>
            </section>
        </main>
    )
}

export default Home
