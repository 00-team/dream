import { WalletIcon } from 'icons/dashboard'
import { Component, onMount } from 'solid-js'

import './style/wallet.scss'

import bg from 'assets/image/card-bg.jpeg'
import logo from 'assets/image/logo.png'
import { addAlert, Special, Counter } from 'comps'
import { TransactionType } from 'models'
import { httpx } from 'shared'
import { createStore } from 'solid-js/store'
import { self } from 'store/self'

export const Wallet: Component = () => {
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
                        <img
                            loading='lazy'
                            decoding='async'
                            draggable={false}
                            src={logo}
                            alt=''
                        />
                    </div>
                </div>
                <div class='center title_hero'>
                    <Counter
                        // duration / interval * 10 for Toman
                        // ~~ for flooring the output
                        steps={~~(self.user.wallet / ((5e3 / 20) * 10))}
                        interval={20}
                        end={self.user.wallet / 10}
                        format
                    />
                    <span>تومان</span>
                </div>
                <div class='bottom'>
                    <span class='title_smaller'>دریم کارت</span>
                    <span class='title_small'>{self.user.name}</span>
                </div>
            </div>
            <ChargeWallet />

            <Transactions />
        </section>
    )
}

const Transactions = () => {
    type State = {
        transactions: TransactionType[]
    }
    const [state, setstate] = createStore<State>({
        transactions: [],
    })

    onMount(() => {
        httpx({
            url: '/api/user/transactions/',
            method: 'GET',
            params: { page: 0 },
            onLoad(x) {
                if (x.status == 200) {
                    setstate({
                        transactions: x.response,
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
            {state.transactions.length >= 1 ? (
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

const ChargeWallet: Component = P => {
    const [state, setState] = createStore({
        amount: 0,
        error: '',
    })

    function ChargeCheck() {
        if (state.amount <= 0) {
            addAlert({
                subject: 'خطا!',
                type: 'error',
                timeout: 5,
                content: 'مقدار واردی باید بیشتر از 10000 تومان باشد.',
            })
        }
    }
    return (
        <div class='charge-wallet'>
            <h4 class='شارژ کیف پول'></h4>
            <div class='inp' classList={{ error: state.error !== '' }}>
                <input
                    type='number'
                    class='title_small'
                    inputMode='numeric'
                    value={state.amount}
                    oninput={e =>
                        setState({ amount: e.currentTarget.valueAsNumber })
                    }
                    min={0}
                    max={100000000}
                    maxLength={256}
                    placeholder={'مقدار شارژ...'}
                />
            </div>
            <Special text='شارژ کن' onclick={ChargeCheck} />
        </div>
    )
}
