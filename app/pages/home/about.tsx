import { BuyIcon, PersonIcon, VerfiedAccIcon } from 'icons/dashboard'
import { TrustIcon } from 'icons/home'
import { SupportIcon } from 'icons/navbar'
import { CreditCardIcon } from 'icons/products'
import { Component, JSX, onMount } from 'solid-js'

import { Application } from '@splinetool/runtime'

import './style/about.scss'

export const About: Component = props => {
    let bottom: HTMLElement

    let canvas: HTMLCanvasElement

    onMount(() => {
        bottom = document.querySelector('div.bottom#about')

        const app = new Application(canvas)
        app.load('/static/spline/about.splinecode')

        document.addEventListener('scroll', () => {
            let transform = bottom.getBoundingClientRect().top - innerHeight

            if (transform <= 0 && transform >= -innerHeight) {
                let divide = innerWidth >= 768 ? 2 : 1
                bottom.style.transform = `translateX(${-transform / divide}px)`
            }
        })
    })

    return (
        <section class='about' id='about'>
            {/* <iframe
                allow='transprency'
                src='https://my.spline.design/untitled-c7de4eec8d45ade0034aceb60e77aa18/'
                style={{ background: 'transparent' }}
            ></iframe> */}
            <canvas id='canvas3d' ref={canvas}></canvas>
            <aside class='data'>
                <h4 class='head title_smaller'>درباره ما</h4>
                <h3 class='section_title header'>چرا DreamPay ؟</h3>
                <p class='title_smaller subheader'>
                    با دیریم پی، بهترین سرویس‌های اکانت اسپاتیفای، اپل موزیک،
                    دیسکورد و ... را تجربه کن! ارائه‌دهنده بهترین اکانت‌های
                    محبوب اینترنت با کیفیت برتر و قیمت مناسب. انتخاب بهتر، سرعت
                    بیشتر! با اعتماد به دیریم پی، مشتریان دسترسی آسان و امن به
                    اکانت‌های مورد نیاز خود را خواهند داشت و از امکانات ویژه‌ی
                    هر یک از سرویس‌ها بهره‌مند خواهند شد.
                </p>
            </aside>
            <div class='bottom' id='about'>
                <Column
                    Icon={TrustIcon}
                    head='اعتماد'
                    subhead='بدون واسطه کمترین قیمت'
                />
                <Column
                    Icon={VerfiedAccIcon}
                    head='اکانت ها'
                    subhead='اکانت ها به صورت کاملا قانونی'
                />
                <Column
                    Icon={SupportIcon}
                    head='پشتیبانی'
                    subhead='پشتیبانی 24 ساعت 7 روز هفته'
                />
                <Column
                    Icon={BuyIcon}
                    head='تحویل'
                    subhead='تحویل به شما بلافصله بعد از خرید'
                />
                <Column
                    Icon={CreditCardIcon}
                    head='پرداخت'
                    subhead='درگاه های امن برای امنیت شما'
                />
                <Column
                    Icon={PersonIcon}
                    head='نوع پرداخت'
                    subhead='قابلیت پرداخت با کارت های خارجی'
                />
            </div>
        </section>
    )
}

interface ColumnProps {
    Icon: (P: any) => JSX.Element
    head: string
    subhead: string
}

const Column: Component<ColumnProps> = P => {
    return (
        <div class='column title_small'>
            <div class='icon'>
                <P.Icon size={30} />
            </div>
            <h4 class='header title'>{P.head}</h4>
            <p class='subheader title_smaller'>{P.subhead}</p>
        </div>
    )
}
