import { Special } from 'comps'
import { InstaIcon, TelegramIcon, WhatsappIcon } from 'icons/footer'
import { Component, onMount } from 'solid-js'

import './style/contact.scss'

const Contact: Component = props => {
    let header: HTMLElement
    let subheader: HTMLElement

    let socials: NodeListOf<HTMLElement>

    onMount(() => {
        header = document.querySelector('h4#contact-header')
        subheader = document.querySelector('h5#contact-subheader')

        socials = document.querySelectorAll('.social#contact')

        document.addEventListener('scroll', () => {
            let top = header.getBoundingClientRect().top - innerHeight

            if (top <= 0) {
                let val = Math.min(-top * 0.5, 450)

                header.style.backgroundImage = `linear-gradient(
                    90deg,
                    transparent ${100 - (val - 10)}%,
                    var(--accent-color) 140%
                )`
                subheader.style.backgroundImage = `linear-gradient(
                    90deg,
                    transparent ${100 - (val - 10)}%,
                    var(--accent-color) 140%
                )`
            }
        })
    })

    return (
        <section
            id='contact'
            class='contact'
            onmouseenter={() => {
                 if(innerWidth < 768) return
                socials.forEach((elem: HTMLElement) => {
                    elem.style.transition = 'none'

                    elem.childNodes.forEach((inner: HTMLElement) => {
                        // stickyButton.className += ' active'
                        inner.style.transition = 'none'
                    })
                })
            }}
            onmousemove={e => {
                 if(innerWidth < 768) return
                 
                socials.forEach((elem: HTMLElement) => {
                    // stickyButton.className += ' active'

                    const pos = elem.getBoundingClientRect()
                    const mx = e.clientX - pos.left - pos.width / 2
                    const my = e.clientY - pos.top - pos.height / 2

                    const valueX = mx * 0.025
                    const valueY = my * 0.05

                    elem.style.transform = `translate(${valueX}px ,${valueY}px)`

                    elem.childNodes.forEach((inner: HTMLElement) => {
                        // stickyButton.className += ' active'

                        inner.style.transform = `translate(${valueX / 2}px ,${valueY / 2}px)`
                    })
                })
            }}
            onmouseleave={() => {
                if(innerWidth < 768) return

                socials.forEach((elem: HTMLElement) => {
                    elem.style.transition =
                        'all 0.2s cubic-bezier(0.45, 0.02, 0.09, 0.98)'
                    elem.style.transform = `none`

                    elem.childNodes.forEach((inner: HTMLElement) => {
                        // stickyButton.className += ' active'
                        inner.style.transition =
                            'all 0.2s cubic-bezier(0.45, 0.02, 0.09, 0.98)'

                        inner.style.transform = `none`
                    })
                })
            }}
        >
            <header class='contact-header'>
                <h4 class='section_title' id='contact-header'>
                    جواب سوالتو پیدا نکردی؟
                </h4>
                <h5 class='title_small subheader' id='contact-subheader'>
                    باما در ارتباط باش!
                </h5>
            </header>
            <div class='contact-wrapper'>
                <div class='email-us'>
                    <h6 class='title_smaller'>پیام به ما</h6>
                    <input
                        type='text'
                        class='username title_smaller'
                        placeholder='نام...'
                    />
                    <input
                        type='text'
                        class='email title_smaller'
                        placeholder='ایمیل...'
                    />
                    <textarea
                        name=''
                        id=''
                        cols='30'
                        rows='10'
                        class='message title_smaller'
                        placeholder='پیام شما...'
                    ></textarea>
                    <Special text='بفرست' />
                </div>
                <div class='socials'>
                    <a
                        class='social icon telegram'
                        id='contact'
                        href='https://t.me/DreamPayOrg'
                    >
                        <TelegramIcon />
                    </a>

                    <a
                        class='social icon whatsapp'
                        id='contact'
                        href='https://wa.me/+905347447553'
                    >
                        <WhatsappIcon />
                    </a>

                    <a
                        class='social icon instagram'
                        id='contact'
                        href='https://instagram.com/dreampay_org/'
                    >
                        <InstaIcon />
                    </a>
                </div>
            </div>
        </section>
    )
}

export default Contact
