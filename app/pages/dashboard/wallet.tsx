import { WalletIcon } from 'icons/dashboard'
import { Component, Show, createEffect, onMount } from 'solid-js'

import './style/wallet.scss'

import bg from 'assets/image/card-bg.jpeg'
import logo from 'assets/image/logo.png'
import { addAlert, Special, Counter } from 'comps'
import { TransactionType } from 'models'
import { httpx } from 'shared'
import { createStore } from 'solid-js/store'
import { self } from 'store/self'
import { useSearchParams } from '@solidjs/router'

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
        page: number
    }
    const [state, setstate] = createStore<State>({
        transactions: [],
        page: 0,
    })
    const [params, setParams] = useSearchParams()

    createEffect(() => {
        transactions_fetch(parseInt(params.page || '0') || 0)
    })

    function transactions_fetch(page: number) {
        setParams({ page })
        httpx({
            url: '/api/user/transactions/',
            method: 'GET',
            params: { page },
            onLoad(x) {
                if (x.status != 200) return
                setstate({ transactions: x.response, page })
            },
        })
    }

    return (
        <div class='transactions'>
            <Show
                when={state.transactions.length > 0}
                fallback={
                    <div class='no-orders title_hero'>
                        شما جابجایی ای نداشتید :(
                    </div>
                }
            >
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
                        {state.transactions.map(t => (
                            <tr>
                                <td>{t.id}</td>
                                <td>{t.kind}</td>
                                <td>{t.vendor}</td>
                                <td>{t.amount}</td>
                                <td>
                                    {new Date(
                                        t.timestamp * 1e3
                                    ).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Show>
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

        httpx({
            url: '/api/user/wallet-add/',
            method: 'POST',
            params: { amount: state.amount },
            onLoad(x) {
                if (x.status != 200) return
                location.replace(x.response)
            },
        })
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
                    step={1e4}
                    max={100000000}
                    maxLength={256}
                    placeholder={'مقدار شارژ...'}
                />
            </div>
            <Special text='شارژ کن' onclick={ChargeCheck} />
        </div>
    )
}
