import { Component, onCleanup, onMount } from 'solid-js'

import './style/customers.scss'

export const Customers = () => {
    let interval: ReturnType<typeof setInterval>

    let section: HTMLElement
    let htmlWord: HTMLElement

    let wordCount = 0

    let lastScrollPosition = scrollY

    const words = ['نظرات مشتری هامون رو ببین!']

    let sentence = ''

    onMount(() => {
        section = document.querySelector<HTMLElement>('section.customers')
        htmlWord = document.querySelector<HTMLElement>('span#type-effect')

        var observer1 = new IntersectionObserver(
            ([entry]) => {
                if (entry && entry.isIntersecting) {
                    entry.target.className += ' active'

                    interval = setInterval(() => {
                        typeMessage()

                        wordCount += 1

                        if (wordCount > words[0].length)
                            return clearInterval(interval)
                    }, 50)
                }
            },
            {
                rootMargin: '-150px',
            }
        )

        observer1.observe(section)

        onCleanup(() => {
            clearInterval(interval)
        })
    })

    function typeMessage() {
        if (!words[0][wordCount]) {
            return
        }

        const currentStr = words[0]

        currentStr.split('')

        let currentLetter = wordCount

        sentence += currentStr[currentLetter]
        htmlWord.innerHTML = sentence
    }

    return (
        <section class='customers' id='customers'>
            <header>
                <h3 class='section_title head'>
                    <span id='type-effect'></span>
                    <div class='cursor'></div>
                </h3>
            </header>
            <CustomerCards />
        </section>
    )
}

const CustomerCards: Component = () => {
    let container: HTMLElement
    let cardRowOne: HTMLElement
    let cardRowTwo: HTMLElement

    onMount(() => {
        container = document.querySelector<HTMLElement>('.customer-cards')
        cardRowOne = document.querySelector<HTMLElement>('.card-row.one')
        cardRowTwo = document.querySelector<HTMLElement>('.card-row.two')

        let oneMax =
            innerWidth <= 768
                ? 1000
                : cardRowOne.getBoundingClientRect().right / 2
        let twoMax =
            innerWidth <= 768
                ? 1000
                : cardRowOne.getBoundingClientRect().left / 2

        document.addEventListener('scroll', () => {
            let top = container.getBoundingClientRect().top - innerHeight

            let oneX = Math.min(oneMax, -top)
            let twoX = Math.min(twoMax, top)

            if (
                top <= 0 &&
                top >= (innerWidth <= 768 ? -innerHeight * 2 : -innerHeight)
            ) {
                cardRowOne.style.transform = `translateX(${Math.max(oneX, 0)}px)`
                cardRowTwo.style.transform = `translateX(${Math.min(twoX, 0)}px)`
            }
        })
    })

    return (
        <div class='customer-cards'>
            <div class='card-row one'>
                <CustomerCard
                    img='https://cdn.downloadefilm.ir/images/cf2a4290-641e-11ee-9b89-43eacfba8a2e.jpg'
                    name='سید حسین داودی'
                    text='کیفیت اکانت ها عالیه و هیچ مشکلی ندارن واقعاً از خریدم راضی‌ام
'
                />
                <CustomerCard
                    img='https://files.virgool.io/upload/users/1515782/posts/aznbjb86qemw/twtmwdg85kgm.jpeg'
                    name='Reza Nox'
                    text='پشتیبانی مشتریان بسیار سریع و حرفه‌ای بود خیلی راضی‌ام'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrVpnG1MBEIlvDFKFvDpK_EKrSwh7CtYrQqEfQCdQZPpxlJOLwDHiX7hRtzpYW-4Si5N0&usqp=CAU'
                    name='دانیال عباسی'
                    text='باورم نمیشه بعد از خرید در کمتر از 2دقیقه اکانت رو بهم تحویل دادن'
                />
                <CustomerCard
                    img='https://cdn.downloadefilm.ir/images/e7409530-5685-11ee-8ce3-4df78765439d.jpg'
                    name='محمد باقری'
                    text='رابط کاربری با سایت عالی بود بدون هیچ مشکلی اکانتم رو پریمیوم کردم'
                />
                <CustomerCard
                    img='https://cdn.downloadefilm.ir/images/aa071ad0-6dc3-11ee-b169-65c7e2a19463.jpg'
                    name='سینا نعمتی'
                    text='خواستم تشکر کنم از اکانت اسپاتیفایی که دادید ماه دومی که دارم ازتون می خرم تا‌حالا نپریده و مشکلی نداشته،ممنون ازتون'
                />
                <CustomerCard
                    img='https://namnamak.com/images/up/19/175.jpg'
                    name='اریا حسنی'
                    text='خرید از اینجا خیلی راحت بود هر سوالی داشتم سریع جواب دادن'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6ESlNmImON8taRqiqiWU6SJZMDAGPj8dkHMkJgdROa7RXuntExs0xvU9TjcefYU0RTe8&usqp=CAU'
                    name='پرهام حبیبی'
                    text='خیلی خوشحالم که اینجا رو پیدا کردم قیمتاشون عالیه'
                />
                <CustomerCard
                    img='https://chibepoosham.com/wp-content/uploads/2016/06/hamid-fadaei.jpg'
                    name='سروش نیمایی'
                    text='کیفیت اکانت ها فوق‌العاده‌ست هیچ مشکلی نداشتم'
                />
            </div>
            <div class='card-row two'>
                <CustomerCard
                    img='https://www.soorban.com/images/news/2022/12/1672469198_Y5jR7.jpg'
                    name='امیررضا'
                    text='قیمت‌هاشون خیلی مناسبه و خدماتشون هم عالی همه اکانتای اشتراکی رو از همینجا خرید میکنم'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx-95kRaDKPsiV0yJA3HUruFfmtg_oTGdV2nj9mj6VYdSIadgnhnhhqb9iGm9XNesUAhI&usqp=CAU'
                    name='مرتضی'
                    text='خیلی سریع اکانت ها فعال شدن و بدون مشکل کار کردن  مرسی از شما'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQPNYNna8e0gc0ANDT8JtjbclngdHYmFaBZog&s'
                    name='محمد'
                    text='بهترین پشتیبانی رو اینجا تجربه کردم خیلی حرفه‌ای هستن'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeV5P0mfYzPaFjk3Ljuz_Ya79xC7EQ_qUY1Q&s'
                    name='Nima'
                    text='همین الان اسپاتیفایم پریمیوم شد سرعتتون دوست داشتم'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyk-peBVwoWw25f7ggdkSxOiBiN0cYoOQ8Rg&s'
                    name='امین'
                    text='خرید از اینجا خیلی راحت بود هر سوالی داشتم سریع جواب دادن'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1xx1WWaVORsbSdId5lTl8d7RQil_Lp4eAyQ&s'
                    name='هیراد'
                    text='خیلی خوشحالم که اینجا رو پیدا کردم قیمتاشون عالیه'
                />
                <CustomerCard
                    img='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTc12_PrCx7AsSayv_leC4bN9WTYxrzLh3x3w&s'
                    name='کیارش'
                    text='کیفیت اکانت ها فوق‌العاده‌ست هیچ مشکلی نداشتم'
                />
            </div>
        </div>
    )
}

interface CustomerCardProps {
    text: string
    name: string
    img: string
}

const CustomerCard: Component<CustomerCardProps> = P => {
    return (
        <div class='customer-card'>
            <img
                class='user-profile'
                loading='lazy'
                decoding='async'
                src={P.img}
            />
            <h4 class='user-name title'>{P.name} </h4>
            <p class='user-review description'>{P.text}</p>
        </div>
    )
}
