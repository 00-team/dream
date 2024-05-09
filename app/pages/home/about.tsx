import { Component, onMount } from 'solid-js'

export const About: Component = props => {
    let aboutSection
    let leftImg
    let rightImg

    onMount(() => {
        aboutSection = document.querySelector<HTMLElement>('section.about-us')
        leftImg = document.querySelector<HTMLElement>('.card.left')
        rightImg = document.querySelector<HTMLElement>('.card.right')

        var observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    rightImg.style.transform = `rotate(${Math.min(
                        entry.intersectionRatio * 10,
                        4
                    )}deg)
                        translateX(${Math.min(500, entry.intersectionRatio * 500)}px)
                        `

                    leftImg.style.transform = `rotate(-${Math.min(
                        entry.intersectionRatio * 10,
                        4
                    )}deg)
                        translateX(-${Math.min(500, entry.intersectionRatio * 500)}px)
                        `
                }
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            }
        )

        observer.observe(aboutSection)
    })

    return (
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
    )
}
