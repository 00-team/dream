import { Route, Router, RouteSectionProps } from '@solidjs/router'
import { Alert } from 'comps'
import { MyProfile } from 'pages/dashboard/myProfile'
import { MyWallet } from 'pages/dashboard/myWallet'
import { Component, lazy } from 'solid-js'
import { render } from 'solid-js/web'

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
                    <Route path={'/myprofile'} component={MyProfile} />
                    <Route path={'/mywallet'} component={MyWallet} />
                    <Route path={'*'} component={MyProfile} />
                </Route>
            </Route>
        </Router>
    )
}

render(() => <Root />, document.getElementById('root'))
