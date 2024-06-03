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
                    <div class='orders-example'></div>
                </div>
            )}
        </section>
    )
}
