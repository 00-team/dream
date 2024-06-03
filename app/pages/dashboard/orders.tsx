import { OrderType } from 'models'
import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'

import './style/orders.scss'

type stateType = {
    orders: OrderType[]
}

export const Orders: Component = props => {
    const [state, setstate] = createStore<stateType>({
        orders: [],
    })

    return (
        <section class='orders'>
            {state.orders.length >= 1 ? (
                <></>
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
                            img='/static/image/logo/netflix.jpg'
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
