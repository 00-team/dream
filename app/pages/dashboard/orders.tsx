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
                    {/* <div class='text-wrapper'>
                        شما سفارش ثبت شده ای ندارید! :(
                    </div> */}
                    <div class='orders-example'>
                        <OrderExample />
                    </div>
                </div>
            )}
        </section>
    )
}

const OrderExample: Component = P => {
    return (
        <div class='order'>
            <div class='kind'>
                <img src='/static/image/logo/spotify.png' alt='' />
                <div class='holder column'>
                    <div class='label title_smaller'>نوع سفارش</div>
                    <div class='data title'>spotify</div>
                </div>
            </div>
            <div class='price column'>
                <div class='label title_smaller'>قیمت پرداختی</div>
                <div class='data title'>100,000 تومان</div>
            </div>
            <div class='status column'>
                <div class='label title_smaller'>وضعیت </div>
                <div class='data title done'>تحویل داده شده </div>
            </div>
        </div>
    )
}
