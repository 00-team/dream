import { Route, Router } from '@solidjs/router'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'

const Home = lazy(() => import('./pages/home'))
const Products = lazy(() => import('./pages/products'))
const Footer = lazy(() => import('./layout/footer'))
const Navbar = lazy(() => import('./layout/navbar'))

import './style/base.scss'
import './style/config.scss'
import './style/font/imports.scss'
import './style/theme.scss'

export const App = () => {
    // onMount(() => {
    //     if ('serviceWorker' in navigator) {
    //         navigator.serviceWorker.register('/sw.js')
    //     }
    // })

    return (
        <>
            <Navbar />
            <Router>
                <Route path={'/'} component={Home} />
                <Route path={'/products'} component={Products} />
                <Route path={'/login'} component={Products} />
            </Router>

            <Footer />
        </>
    )
}

render(() => <App />, document.getElementById('root'))
