import { addAlert } from 'comps'
import { ArrowDownIcon } from 'icons/home'
import { OrderType } from 'models'
import { httpx } from 'shared'
import { Component, createSignal, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'

import './style/orders.scss'

type stateType = {
    orders: OrderType[]
}

export const Orders: Component = props => {
    const [state, setstate] = createStore<stateType>({
        orders: [],
    })

    onMount(() => {
        httpx({
            url: '/api/orders/',
            method: 'GET',
            params: { page: 0 },
            onLoad(x) {
                if (x.status == 200) {
                    setstate({ orders: x.response })
                } else {
                    addAlert({
                        type: 'error',
                        timeout: 5,
                        content: 'مشکلی پیش امده کمی بعد دوباره تلاش کنید.',
                        subject: 'خطا!',
                    })
                }
            },
        })
    })

    return (
        <section class='orders'>
            {state.orders.length >= 1 ? (
                <div class='orders-wrapper'>
                    {state.orders.map(order => (
                        <Order {...order} />
                    ))}
                </div>
            ) : (
                <div class='no-orders title_hero'>
                    <div class='text-wrapper'>
                        شما سفارش ثبت شده ای ندارید! :(
                    </div>
                    <div class='orders-example'>
                        <OrderExample
                            img='/static/image/logo/spotify.png'
                            kind='spotify'
                            price={100000}
                            status='done'
                        />
                        <OrderExample
                            img='/static/image/logo/netflix.png'
                            kind='netflix'
                            price={20000}
                            status='refunded'
                        />
                        <OrderExample
                            img='/static/image/logo/discord.png'
                            kind='discord'
                            price={600000}
                            status='waiting'
                        />
                        <OrderExample
                            img='/static/image/logo/canva.png'
                            kind='canva'
                            price={400000}
                            status='done'
                        />
                        <OrderExample
                            img='/static/image/logo/prime.png'
                            kind='prime'
                            price={50000}
                            status='refunded'
                        />
                        <OrderExample
                            img='/static/image/logo/apple-music.png'
                            kind='apple music'
                            price={900000}
                            status='waiting'
                        />
                    </div>
                </div>
            )}
        </section>
    )
}

interface OrderExample {
    img: string
    kind: OrderType['kind']
    price: OrderType['price']
    status: OrderType['status']
}

const OrderExample: Component<OrderExample> = P => {
    onMount(() => {
        console.log(P.status)
    })
    return (
        <div class='order'>
            <div class='kind'>
                <img loading='lazy' decoding='async' src={P.img} alt='' />
                <div class='holder column'>
                    <div class='label title_smaller'>نوع سفارش</div>
                    <div class='data title'>{P.kind}</div>
                </div>
            </div>
            <div class='price column'>
                <div class='label title_smaller'>قیمت پرداختی</div>
                <div class='data title'>{P.price} تومان</div>
            </div>
            <div class='status column'>
                <div class='label title_smaller'>وضعیت </div>
                <div class={`data title ${P.status}`}>{P.status}</div>
            </div>
        </div>
    )
}

const Order: Component<OrderType> = P => {
    const [active, setactive] = createSignal(false)

    const getTime = (timestamp: number) => {
        let offset = Math.abs(new Date().getTimezoneOffset()) * 60

        return (timestamp + offset) * 1000
    }

    return (
        <div
            class='order'
            classList={{ active: active() }}
            onclick={() => setactive(s => !s)}
        >
            <div class='arrow'>
                <ArrowDownIcon size={30} />
            </div>
            <div class='upper'>
                <div class='kind'>
                    <img loading='lazy' decoding='async' src={P.img} alt='' />
                    <div class='holder column'>
                        <div class='label title_smaller'>نوع سفارش</div>
                        <div class='data title'>{P.kind}</div>
                    </div>
                </div>
                <div class='price column'>
                    <div class='label title_smaller'>قیمت پرداختی</div>
                    <div class='data title'>{P.price} تومان</div>
                </div>
                <div class='status column'>
                    <div class='label title_smaller'>وضعیت </div>
                    <div class={`data title done`}>{P.status} </div>
                </div>
            </div>
            <div class='lower'>
                <div class='id column'>
                    <div class='label title_smaller'>شماره سفارش </div>
                    <div class='data title'>{P.id}</div>
                </div>
                <div class='price column'>
                    <div class='label title_smaller'>توضیحات</div>
                    <div class='data title'>email: elan@dsaft.com</div>
                    <div class='data title'>password: sadsdaweesa</div>
                    <div class='data title_smaller order-desc'>
                        لورمزیانمزن انشیاسنمشای نمشاسینا شنمیانمسشا
                    </div>
                </div>
                <div class='status column'>
                    <div class='label title_smaller'>تاریخ ثبت</div>
                    <div class={`data title done`}>
                        {new Date(getTime(P.timestamp)).toLocaleDateString(
                            'fa-IR'
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
