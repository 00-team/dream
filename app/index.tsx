import { Route, Router, RouteSectionProps } from '@solidjs/router'
import { Alert } from 'comps'
import { Orders } from 'pages/dashboard/orders'
import { Profile } from 'pages/dashboard/profile'
import { Wallet } from 'pages/dashboard/wallet'
import { Component, createEffect, lazy, onMount } from 'solid-js'
import { render } from 'solid-js/web'
import { setTheme, theme } from 'store/theme'

const Home = lazy(() => import('./pages/home'))
const Products = lazy(() => import('./pages/products'))
const Login = lazy(() => import('./pages/auth/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Footer = lazy(() => import('./layout/footer'))
const Navbar = lazy(() => import('./layout/navbar'))

import './style/base.scss'
import './style/config.scss'
import './style/fonts/imports.scss'
import './style/theme.scss'

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
            <Footer />
            <Alert />
        </>
    )
}

const Root = () => {
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
