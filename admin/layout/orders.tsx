import { createStore } from 'solid-js/store'
import './style/orders.scss'
import { OrderModel } from 'models'
import { useNavigate, useParams } from '@solidjs/router'
import { createEffect } from 'solid-js'
import { httpx } from 'shared'

export default () => {
    const UP = useParams()
    const navigate = useNavigate()

    type State = {
        orders: OrderModel[]
        page: number
    }

    const [state, setState] = createStore<State>({ orders: [], page: 0 })

    createEffect(() => {
        let pid = parseInt(UP.page || '0')

        if (isNaN(pid)) {
            return navigate('/orders/')
        }

        setState({ page: pid })
        fetch_orders(pid)
    })

    function fetch_orders(page: number) {
        httpx({
            url: '/api/admin/orders/',
            params: { page },
            method: 'GET',
            onLoad(x) {
                setState({ orders: x.response, page })
            },
        })
    }

    return (
        <div class='orders-fnd'>
            <div class='order-list'>
                {state.orders.map(o => (
                    <div class='order'>
                        {o.kind} - {o.price}
                    </div>
                ))}
            </div>
        </div>
    )
}
