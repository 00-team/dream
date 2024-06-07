import { Navigate, Route, RouteSectionProps, Router } from '@solidjs/router'
import { Component, Show, createEffect, lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { self } from 'store/self'

import Alert from 'comps/alert'

import './style/index.scss'

const Orders = lazy(() => import('./layout/orders'))
import Navbar from './layout/navbar'

const App: Component<RouteSectionProps> = P => {
    return (
        <>
            <Navbar />
            {P.children}
        </>
    )
}

const Root = () => {
    createEffect(() => {
        if (!self.loged_in || !self.user.admin) {
            if (import.meta.env.PROD) {
                location.replace('/login')
            } else {
                console.log('go to login')
            }
        }
    })

    return (
        <Show
            when={self.loged_in && self.user.admin}
            fallback={<a href='/login'>Login</a>}
        >
            <Router base='/admin'>
                <Route path='/' component={App}>
                    <Route
                        path='/'
                        component={() => <Navigate href='/orders' />}
                    />
                    <Route path='/orders' component={Orders} />
                    <Route path='/discounts' component={Orders} />
                    <Route path='*' component={() => <span>Not Found</span>} />
                </Route>
            </Router>
            <Alert />
        </Show>
    )
}

render(() => <Root />, document.getElementById('root'))
