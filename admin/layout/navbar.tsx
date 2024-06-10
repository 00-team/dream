import { A } from '@solidjs/router'

import './style/navbar.scss'

export default () => {
    return (
        <nav class='navbar-fnd'>
            <div class='links'>
                <A href='/orders'>Orders</A>
                <A href='/discounts'>Discounts</A>
            </div>
        </nav>
    )
}
