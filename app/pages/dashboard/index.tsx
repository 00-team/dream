import { A, useNavigate } from '@solidjs/router'
import { UserIcon } from 'icons'
import { LogoutIcon, PersonIcon, WalletIcon } from 'icons/dashboard'
import { Component, createEffect, Show } from 'solid-js'
import { self } from 'store/self'

import './style/dashboard.scss'

const Dashboard: Component = props => {
    const nav = useNavigate()

    createEffect(() => {
        console.log(self.user)

        if (!self.loged_in) nav('/login')
    })

    return (
        <main class='dashboard'>
            <aside class='sidebar'>
                <div class='avatar'>
                    <div class='profile-avatar'>
                        <Show when={self.user.photo} fallback={<UserIcon />}>
                            <img
                                draggable={false}
                                loading='lazy'
                                decoding='async'
                                src={`/record/${self.user.id}:${self.user.photo}`}
                            />
                        </Show>
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
                    <A href='/dashboard/myprofile' class='link'>
                        <PersonIcon />
                        اطلاعات من
                    </A>
                    <A href='/dashboard/mywallet' class='link'>
                        <WalletIcon />
                        کیف پول
                    </A>
                </div>
                <button onclick={() => {}} class='logout-cta title_small'>
                    <LogoutIcon />
                    خروج
                </button>
            </aside>
            {/* @ts-ignore */}
            <aside class='wrapper'>{props.children}</aside>
        </main>
    )
}

export default Dashboard
