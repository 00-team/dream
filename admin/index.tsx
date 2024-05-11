import { Navigate, Route, Router, redirect } from '@solidjs/router'
import { createEffect, lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { self } from 'store/self'

import './style/index.scss'

const Orders = lazy(() => import('./layout/orders'))

const Root = () => {
    createEffect(() => {
        if ((import.meta.env.PROD && !self.loged_in) || !self.user.admin) {
            location.replace('/login')
        }
    })

    return (
        <Router base='/admin'>
            <Route path='/' component={() => <Navigate href='/orders' />} />
            <Route path='/orders' component={Orders} />
            <Route path='/orders/:page' component={Orders} />
            <Route path='*' component={() => <span>not found</span>} />
        </Router>
    )
}

render(() => <Root />, document.getElementById('root'))
