import { A, RouteSectionProps, useNavigate } from '@solidjs/router'
import { addAlert } from 'comps'
import {
    LogoutIcon,
    PersonIcon,
    TransactionsIcon,
    WalletIcon,
} from 'icons/dashboard'
import { httpx } from 'shared'
import { Component, createEffect, onMount, Show } from 'solid-js'
import { self, setSelf } from 'store/self'

import './style/dashboard.scss'
import { CartStorage } from 'models'

const Dashboard: Component<RouteSectionProps> = P => {
    const nav = useNavigate()

    createEffect(() => {
        if (!self.loged_in) nav('/login')
        try {
            let cart: CartStorage = JSON.parse(localStorage.getItem('cart'))
            if (cart.action == 'show') {
                return location.replace('/products/')
            }
        } catch {}
    })

    function logoutUser() {
        httpx({
            url: '/api/user/logout/',
            method: 'POST',
            onLoad(x) {
                if (x.status == 200) {
                    setSelf({
                        loged_in: false,
                        fetch: true,
                        user: {
                            id: 0,
                            name: '',
                            wallet: 0,
                            in_hold: 0,
                            token: '',
                            photo: null,
                            admin: false,
                            banned: false,
                            phone: '',
                        },
                    })
                    nav('/login')
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
    }

    return (
        <main class='dashboard'>
            <aside class='sidebar'>
                <div class='avatar'>
                    <div class='profile-avatar'>
                        <img
                            draggable={false}
                            loading='lazy'
                            decoding='async'
                            src={
                                self.user.photo
                                    ? `/record/${self.user.id}:${self.user.photo}`
                                    : '/static/image/dashboard/default-avatar.webp'
                            }
                        />
                    </div>
                    <div class='name-avatar title_small'>
                        <Show
                            when={self.user.name}
                            fallback={<span>اسم شما</span>}
                        >
                            <h2>{self.user.name}</h2>
                        </Show>
                    </div>
                </div>
                <div class='links title_small'>
                    <A href='/dashboard/' class='link'>
                        <PersonIcon />
                        اطلاعات من
                    </A>
                    <A href='/dashboard/wallet/' class='link'>
                        <WalletIcon />
                        کیف پول
                    </A>
                    <A href='/dashboard/orders/' class='link'>
                        <TransactionsIcon />
                        سفارش های من
                    </A>
                </div>
                <button
                    onclick={() => logoutUser()}
                    class='logout-cta title_small'
                >
                    <LogoutIcon />
                    خروج
                </button>
            </aside>
            <aside class='dashboard-wrapper'>{P.children}</aside>
        </main>
    )
}

export default Dashboard
