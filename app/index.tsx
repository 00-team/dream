import { Route, Router, RouteSectionProps } from '@solidjs/router'
import { Alert } from 'comps'
import { Orders } from 'pages/dashboard/orders'
import { Profile } from 'pages/dashboard/profile'
import { Wallet } from 'pages/dashboard/wallet'
import { Component, createEffect, lazy, onMount } from 'solid-js'
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
import './style/signature.scss'

import './layout/style/footer.scss'

import './signature'

const App: Component<RouteSectionProps> = P => {
    return (
        <>
            <Navbar />
            {P.children}
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
