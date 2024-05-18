import { Component, onMount } from 'solid-js'

import './style/customers.scss'

export const Customers: Component = props => {
    let htmlWord: HTMLElement

    const words = ['نظرات مشتری هامون رو ببین!']

    onMount(() => {
        htmlWord = document.querySelector<HTMLElement>('span#type-effect')

        typeMessage()
    })

    let currentMessage = 0

    function typeMessage() {
        if (!words[currentMessage]) {
            currentMessage = 0
        }
        const currentStr = words[currentMessage]
        currentStr.split('')
        let part = ''
        let currentLetter = 0
        let int1 = setInterval(() => {
            if (!currentStr[currentLetter]) {
                currentMessage++

                clearInterval(int1)
            } else {
                part += currentStr[currentLetter++]
                htmlWord.innerHTML = part
            }
        }, 100)
    }

    return (
        <section class='customers'>
            <header>
                <h3 class='section_title head'>
                    <span id='type-effect'>نظرات مشتری هامون رو dasdsa!</span>
                    <div class='cursor'></div>
                </h3>
            </header>
        </section>
    )
}
