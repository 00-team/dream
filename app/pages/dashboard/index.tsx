import { A, RouteSectionProps, useNavigate } from '@solidjs/router'
import {
    LogoutIcon,
    PersonIcon,
    TransactionsIcon,
    WalletIcon,
} from 'icons/dashboard'
import { Component, createEffect, Show } from 'solid-js'
import { self, setSelf } from 'store/self'

import './style/dashboard.scss'

const Dashboard: Component<RouteSectionProps> = P => {
    const nav = useNavigate()

    createEffect(() => {
        console.log(self.user)

        if (!self.loged_in) nav('/login')
    })

    function logoutUser() {
        document.cookie =
            'Authorization=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
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
                    <A href='/dashboard/transactions/' class='link'>
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
