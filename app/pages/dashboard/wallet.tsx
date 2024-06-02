import { WalletIcon } from 'icons/dashboard'
import { Component } from 'solid-js'

import './style/wallet.scss'

import logo from 'assets/image/logo.png'
import bg from 'assets/image/card-bg.jpeg'
import CountUp from 'comps/countUp'

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
                <div class='bottom'></div>
            </div>
        </section>
    )
}
