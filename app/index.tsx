import { Route, Router } from '@solidjs/router'
import Footer from 'layout/footer'
import { lazy } from 'solid-js'
import { render } from 'solid-js/web'

const Home = lazy(() => import('./pages/home'))

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
            <Router>
                <Route path={'/'} component={Home} />
            </Router>

            <Footer />
        </>
    )
}

render(() => <App />, document.getElementById('root'))
