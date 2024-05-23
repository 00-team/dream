import { ArrowDownIcon, FaqIcon } from 'icons/home'
import { Component, createSignal, onMount } from 'solid-js'

import './style/faq.scss'

const Faq: Component = props => {
    let header: HTMLElement
    let icons: NodeListOf<HTMLElement>
    let faqs: NodeListOf<HTMLElement>

    onMount(() => {
        header = document.querySelector('.faq-header')
        icons = document.querySelectorAll('.header-icon')

        faqs = document.querySelectorAll('.faq-row')

        var observer1 = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    let transform = Math.floor(entry.intersectionRatio * 50)

                    icons.forEach((elem: HTMLElement) => {
                        elem.style.transform = `translateY(${-(-50 + transform)}px)`
                    })
                }
            },
            {
                threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
            }
        )

        observer1.observe(header)

        var observer2 = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    entry.target.className += ' transform'
                    observer2.unobserve(entry.target)
                }
            },
            {
                threshold: 1,
            }
        )

        faqs.forEach((elem: HTMLElement) => observer2.observe(elem))
    })

    return (
        <section class='faq-container'>
            <header class='faq-header'>
                <div class='header-icon'>
                    <FaqIcon size={50} />
                </div>
                <h3 class='section_title'>سوالات متداول</h3>
                <div class='header-icon reverse'>
                    <FaqIcon class='reverse' size={50} />
                </div>
            </header>
            <div class='faq-wrapper'>
                <FaqRow
                    q='چه روش های پرداختی را می پذیرید؟'
                    a='لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است'
                />
                <FaqRow
                    q='چگونه می توانم با پشتیبانی تماس بگیرم'
                    a='
                پشتیبانی دریم پی 24 ساعته روز، در هفت روز هفته در خدمت شماست و از بخش ارتباط با ما میتونید با ما در ارتباط باشید.'
                />
                <FaqRow
                    q='چه روش های پرداختی را می پذیرید؟'
                    a='لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است'
                />
                <FaqRow
                    q='چگونه می توانم با پشتیبانی تماس بگیرم'
                    a='
                پشتیبانی دریم پی 24 ساعته روز، در هفت روز هفته در خدمت شماست و از بخش ارتباط با ما میتونید با ما در ارتباط باشید.'
                />
                <FaqRow
                    q='چه روش های پرداختی را می پذیرید؟'
                    a='لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است'
                />
                <FaqRow
                    q='چگونه می توانم با پشتیبانی تماس بگیرم'
                    a='
                پشتیبانی دریم پی 24 ساعته روز، در هفت روز هفته در خدمت شماست و از بخش ارتباط با ما میتونید با ما در ارتباط باشید.'
                />
            </div>
        </section>
    )
}

interface FaqRowProps {
    q: string
    a: string
}

export const FaqRow: Component<FaqRowProps> = P => {
    const [open, setOpen] = createSignal(false)

    return (
        <div
            class='faq-row'
            classList={{ active: open() }}
            onclick={() => setOpen(s => !s)}
        >
            <h4 class='title faq-title'>
                <span>{P.q}</span>
                <ArrowDownIcon />
            </h4>
            <p class='title_smaller faq-description'>{P.a}</p>
        </div>
    )
}

export default Faq
