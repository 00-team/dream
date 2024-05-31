import { Route, RouteSectionProps, Router } from '@solidjs/router'
import { Component, lazy } from 'solid-js'
import { render } from 'solid-js/web'

const Home = lazy(() => import('./pages/home'))
const Products = lazy(() => import('./pages/products'))
const Login = lazy(() => import('./pages/auth/login'))
const Dashboard = lazy(() => import('./pages/dashboard'))
const Footer = lazy(() => import('./layout/footer'))
const Navbar = lazy(() => import('./layout/navbar'))
import { Alert } from 'comps'

import './style/base.scss'
import './style/config.scss'
import './style/fonts/imports.scss'
import './style/theme.scss'

const App: Component<RouteSectionProps> = P => {
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
                <Route path='/dashboard/' component={Dashboard} />
            </Route>
        </Router>
    )
}

render(() => <Root />, document.getElementById('root'))
