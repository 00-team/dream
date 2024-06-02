import { WalletIcon } from 'icons/dashboard'
import { Component, onMount } from 'solid-js'

import './style/wallet.scss'

import bg from 'assets/image/card-bg.jpeg'
import logo from 'assets/image/logo.png'
import { addAlert } from 'comps'
import CountUp from 'comps/countUp'
import { OrdersType } from 'models'
import { httpx } from 'shared'
import { createStore } from 'solid-js/store'
import { self } from 'store/self'

export const Wallet: Component = props => {
    return (
        <section class='wallet'>
            <div
                class='wallet-current'
                style={{
                    'background-image': `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.6)),
                    url(${bg})`,
                }}
            >
                <div class='head'>
                    <div class='holder title_smaller'>
                        <WalletIcon />
                        موجودی
                    </div>
                    <div class='logo'>
                        <img src={logo} alt='' />
                    </div>
                </div>
                <div class='center title_hero'>
                    <CountUp steps={12345} addTime={20} end={1000000} format />
                </div>
                <div class='bottom'>
                    <span class='title_smaller'>دریم کارت</span>
                    <span class='title_small'>{self.user.name}</span>
                </div>
            </div>

            <Transactions />
        </section>
    )
}

type stateType = {
    orders: OrdersType[]
}

const Transactions: Component = P => {
    const [state, setstate] = createStore<stateType>({
        orders: [],
    })

    onMount(() => {
        httpx({
            url: '/api/user/transactions/',
            method: 'GET',
            onLoad(x) {
                if (x.status == 200) {
                    setstate({
                        orders: x.response,
                    })
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
        <div class='transactions'>
            {state.orders.length >= 1 ? (
                <table>
                    <thead class='title_small'>
                        <tr>
                            <th class='id'>شماره</th>
                            <th class='kind'>نوع</th>
                            <th class='vendor'>سرویس</th>
                            <th class='amount'>مقدار</th>
                            <th class='date'>تاریخ</th>
                        </tr>
                    </thead>
                    <tbody class='title_smaller'>
                        <tr>
                            <td>1</td>
                            <td>یسشیش</td>
                            <td>یسشیشس</td>
                            <td>09120945</td>
                            <td>یسشیش</td>
                        </tr>
                    </tbody>
                </table>
            ) : (
                <div class='no-orders title_hero'>
                    شما جابجایی ای نداشتید :(
                </div>
            )}
        </div>
    )
}
