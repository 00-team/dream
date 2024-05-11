import { Route, Router } from '@solidjs/router'
import { createEffect, lazy } from 'solid-js'
import { render } from 'solid-js/web'
import { self } from 'store/self'

import './style/index.scss'

const Root = () => {
    createEffect(() => {
        if ((import.meta.env.PROD && !self.loged_in) || !self.user.admin) {
            location.replace('/login')
        }
    })

    return (
        <Router base='/admin'>
            <Route path='/' component={lazy(() => import('./layout/orders'))} />
            <Route path='*' component={() => <span>not found</span>} />
        </Router>
    )
}

render(() => <Root />, document.getElementById('root'))
