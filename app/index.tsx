import { Route, Router, RouteSectionProps } from '@solidjs/router'
import { Alert } from 'comps'
import { Orders } from 'pages/dashboard/orders'
import { Profile } from 'pages/dashboard/profile'
import { Wallet } from 'pages/dashboard/wallet'
import { Component, createEffect, lazy, onCleanup, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { setTheme, theme } from 'store/theme'

import Navbar from './layout/navbar'
import Home from './pages/home'
const Products = lazy(() => import('./pages/products'))
const Login = lazy(() => import('./pages/auth/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))

import './style/base.scss'
import './style/config.scss'
import './style/fonts/imports.scss'
import './style/theme.scss'

import './layout/signature/style.scss'
import './layout/style/footer.scss'

const App: Component<RouteSectionProps> = P => {
    const prefersDarkColorScheme = () =>
        matchMedia && matchMedia('(prefers-color-scheme: dark)').matches

    onMount(() => {
        if (prefersDarkColorScheme()) {
            setTheme('dark')
        }
    })

    createEffect(() => {
        document.documentElement.setAttribute('data-theme', theme())
    })

    // onMount(() => {
    //     if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker.register('/sw.js')
    //     }
    // })

    return (
        <>
            <Navbar />
            {P.children}
            {/* <Footer />
            <Signature /> */}
            <Alert />
        </>
    )
}

let LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#!%^&*()_-+=/'
let ORIGIN = 'developed by 00 team'

const Root = () => {
    let signature: HTMLElement

    let interval
    let interval2

    function hackEffect() {
        if (!signature) return

        let counter = 0

        interval = setInterval(() => {
            if (counter >= ORIGIN.length) {
                // signature.style.textShadow = '0 0 74px gold;'
                clearInterval(interval)
                if (!signature.classList.contains('active'))
                    signature.className += ' active'
            }

            signature.innerText = signature.innerText
                .split('')
                .map((letter, index) => {
                    if (index < counter) return ORIGIN[index]

                    return LETTERS[Math.floor(Math.random() * LETTERS.length)]
                })
                .join('')
        }, 30)

        interval2 = setInterval(() => {
            counter++
            if (counter >= ORIGIN.length) clearInterval(interval2)
        }, 100)
    }

    onMount(() => {
        signature = document.querySelector<HTMLElement>('a.signature-00-team')

        let observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                hackEffect()
                observer.unobserve(signature)
            }
        }, {})

        observer.observe(signature)
    })

    onCleanup(() => {
        clearInterval(interval)
        clearInterval(interval2)
    })
    return (
        <Router>
            <Route component={App}>
                <Route path='/' component={Home} />
                <Route path='/products/' component={Products} />
                <Route path='/login/' component={Login} />
                <Route path='/dashboard/' component={Dashboard}>
                    <Route path='/' component={Profile} />
                    <Route path='/wallet/' component={Wallet} />
                    <Route path='/orders/' component={Orders} />
                    <Route path='*' component={Profile} />
                </Route>
                <Route
                    path='*'
                    component={() => (
                        <span style={{ 'font-size': '30vh' }}>404</span>
                    )}
                />
            </Route>
        </Router>
    )
}

render(() => <Root />, document.getElementById('root'))
