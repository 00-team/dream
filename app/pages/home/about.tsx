import { CheckIcon, CrossIcon } from 'icons/home'
import { Component, onMount } from 'solid-js'

import VanillaTilt from 'utils/tilt'

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

    // let mouseEnter = (
    //     e: MouseEvent & {
    //         currentTarget: HTMLDivElement
    //         target: Element
    //     }
    // ) => {
    //     const el = e.currentTarget

    //     el.className += ' active'
    // }

    // let mouseMove = (
    //     e: MouseEvent & {
    //         currentTarget: HTMLDivElement
    //         target: Element
    //     }
    // ) => {
    //     e.stopPropagation()

    //     const el = e.currentTarget
    //     const pos = el.getBoundingClientRect()
    //     const mx = e.clientX - pos.left - pos.width / 2
    //     const my = e.clientY - pos.top - pos.height / 2

    //     console.log('x:', mx)
    //     console.log('y:', my)

    //     el.style.transform = `rotate3d(${mx * -0.1}, ${my * -0.3}, 0, 12deg)`
    // }
    // let mouseLeave = (
    //     e: MouseEvent & {
    //         currentTarget: HTMLDivElement
    //         target: Element
    //     }
    // ) => {
    //     const el = e.currentTarget

    //     let newClass = el.className.replace(' active', '')

    //     el.className = newClass

    //     el.style.transform = ''
    // }

    let Cards

    onMount(() => {
        Cards = document.querySelectorAll('div.card-wrapper')

        VanillaTilt.init(Cards, {
            perspective: 1400,
            scale: 1,
            gyroscopeMaxAngleY: 10,
            gyroscopeMaxAngleX: 10,
            max: 5,
        })
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
                    <div
                        class='card-wrapper'
                        // onMouseEnter={mouseEnter}
                        // onmousemove={mouseMove}
                        // onmouseleave={mouseLeave}
                    >
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
                                سرعت پایین در تحویل
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
                </div>
                <div class='card right'>
                    <div
                        class='card-wrapper'
                        // onMouseEnter={mouseEnter}
                        // onmousemove={mouseMove}
                        // onmouseleave={mouseLeave}
                    >
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
                                پشتیبانی 24 ساعته
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
            </div>
        </section>
    )
}
