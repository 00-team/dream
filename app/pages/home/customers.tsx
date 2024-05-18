import { Component, onMount } from 'solid-js'

import './style/customers.scss'

export const Customers: Component = props => {
    let section: HTMLElement
    let htmlWord: HTMLElement

    let wordCount = 0

    let lastScrollPosition = scrollY

    const words = ['نظرات مشتری هامون رو ببین!']

    let sentence = ''

    function typeMessage() {
        if (!words[0][wordCount]) {
            return
        }

        const currentStr = words[0]

        currentStr.split('')

        let currentLetter = wordCount

        sentence += currentStr[currentLetter]
        htmlWord.innerHTML = sentence

        console.log(sentence)
    }

    onMount(() => {
        section = document.querySelector<HTMLElement>('section.customers')
        htmlWord = document.querySelector<HTMLElement>('span#type-effect')

        document.onscroll = () => {
            let top = section.getBoundingClientRect().top - innerHeight + 100

            if (top <= 0) {
                let currentScrollPosition = scrollY

                if (currentScrollPosition > lastScrollPosition) {
                    if (wordCount <= words[0].length + 1) {
                        let letter = Math.floor(-top / 20) - 1

                        if (letter === wordCount) return

                        wordCount = letter

                        typeMessage()
                    }
                }

                lastScrollPosition = currentScrollPosition
            }
        }
    })

    return (
        <section class='customers'>
            <header>
                <h3 class='section_title head'>
                    <span id='type-effect'></span>
                    <div class='cursor'></div>
                </h3>
            </header>
        </section>
    )
}
