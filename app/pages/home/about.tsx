import { CheckIcon, CrossIcon } from 'icons/home'
import { Component, onMount } from 'solid-js'

import './style/about.scss'

export const About: Component = props => {
    let aboutSection
    let leftImg
    let rightImg

    onMount(() => {
        aboutSection = document.querySelector<HTMLElement>('section.about-us')
        leftImg = document.querySelector<HTMLElement>('.card.left')
        rightImg = document.querySelector<HTMLElement>('.card.right')

        let transformMul = 520
        let rotateMul = 5

        let transformMax = (): number => {
            if (innerWidth >= 1440) return 460
            if (innerWidth >= 1300) return 390
            if (innerWidth >= 1100) return 370
            if (innerWidth >= 1025) return 320
            if (innerWidth >= 768) return 160
            return 20
        }

        var observer = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    rightImg.style.transform = `rotate(${Math.min(
                        entry.intersectionRatio * rotateMul,
                        4
                    )}deg)
                        translateX(${Math.min(transformMax(), entry.intersectionRatio * transformMul)}px)
                        `

                    leftImg.style.transform = `rotate(-${Math.min(
                        entry.intersectionRatio * rotateMul,
                        4
                    )}deg)
                        translateX(-${Math.min(transformMax(), entry.intersectionRatio * transformMul)}px)
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
            <div class='cards-container'>
                <div class='card  left'>
                    <h5 class='title'>سرویس های دیگه</h5>
                    <div class='card-details title'>
                        <div class='detail'>
                            <CrossIcon />
                            با واسطه، قیمت بالاتر{' '}
                        </div>
                        <div class='detail'>
                            <CrossIcon />
                            اکانت ها کرکی{' '}
                        </div>
                        <div class='detail'>
                            <CrossIcon />
                            پشتیبانی ضعیف{' '}
                        </div>
                        <div class='detail'>
                            <CrossIcon />
                            سرعت انی در تحویل
                        </div>
                        <div class='detail'>
                            <CrossIcon />
                            درگاه های ناامن{' '}
                        </div>
                        <div class='detail'>
                            <CrossIcon />
                            پرداخت های فقط داخلی
                        </div>
                    </div>
                </div>
                <div class='card right'>
                    <h5 class='logo title_hero'>Dream Pay</h5>
                    <div class='card-details title'>
                        <div class='detail'>
                            <CheckIcon />
                            بدون واسط، کمترین قیمت{' '}
                        </div>
                        <div class='detail'>
                            <CheckIcon />
                            اکانت ها قانونی{' '}
                        </div>
                        <div class='detail'>
                            <CheckIcon />
                            پشتیبانی 24 / 7{' '}
                        </div>
                        <div class='detail'>
                            <CheckIcon />
                            سرعت انی در تحویل
                        </div>
                        <div class='detail'>
                            <CheckIcon />
                            پرداخت امن{' '}
                        </div>
                        <div class='detail'>
                            <CheckIcon />
                            پرداخت با کارت های خارجی{' '}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
