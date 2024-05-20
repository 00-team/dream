import { FaqIcon } from 'icons/home'
import { Component } from 'solid-js'

import './style/faq.scss'

const Faq: Component = props => {
    return (
        <section class='faq-container'>
            <header class='header'>
                <FaqIcon size={50} />
                <h3 class='section_title'>سوالات متداول</h3>
                <FaqIcon class='reverse' size={50} />
            </header>
            <div class='faq-wrapper'></div>
        </section>
    )
}

export default Faq
