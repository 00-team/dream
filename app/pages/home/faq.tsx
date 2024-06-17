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
        <section class='faq-container' id='faq'>
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
                    a='شما میتونید با استفاده از درگاه امن زرین پال برای شارژ حساب کاربریتون استفاده کنید'
                />
                <FaqRow
                    q='چطور بهتون اعتماد کنم؟'
                    a='وبسایت ما در سامانه اینماد کشور ثبت شد و تمام فعالیت های ما تحت نظر این سامانه هست.'
                />
                <FaqRow
                    q='بعد از گذشت چند ساعت اکانتم فعال نشد چیکار کنم؟'
                    a='در صورت فعال نشدن اکانت در زمان مشخص شده میتونید با پشتیبانی تلگرام و واتساپ در تماس باشید.'
                />
                <FaqRow
                    q='چگونه میتوانم با پشتیبانی تماس باشم؟'
                    a='پشتیبانی دریم پی به صورت 24 ساعته و در هفت روز هفته در خدمت شماست که از بخش ارتباط با ما میتونید با پشتیبانی در ارتباط باشید'
                />
                <FaqRow
                    q='پرداختم با موفقیت انجام شده ولی موجودی حسابم افزایش پیدا نکرده'
                    a='در این صورت پرداختتون توسط درگاه تایید نشده و مبلغ کسر شده از حساب بانکیتون تا 72 ساعت آینده به حسابتون برمیگرده'
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
