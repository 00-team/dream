import { createStore } from 'solid-js/store'
import './style/orders.scss'
import { OrderModel, UserModel } from 'models'
import { useNavigate, useParams } from '@solidjs/router'
import { Show, createEffect } from 'solid-js'
import { httpx } from 'shared'
import { BanIcon, CircleCheckBigIcon, CircleCheckIcon } from 'icons'
import { Confact } from 'comps'

export default () => {
    const UP = useParams()
    const navigate = useNavigate()

    type OrderInfo = OrderModel & {
        user: UserModel
    }

    type State = {
        orders: OrderInfo[]
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
                let orders: OrderModel[] = x.response.orders
                let users: UserModel[] = x.response.users

                let orders_info = orders.map(o => ({
                    ...o,
                    user: users.find(u => u.id == o.user),
                })) as OrderInfo[]

                setState({ orders: orders_info, page })
            },
        })
    }

    type UOS = Exclude<OrderModel['status'], 'wating'>
    function update_order(id: number, status: UOS) {
        httpx({
            url: `/api/admin/orders/${id}/`,
            method: 'PATCH',
            json: {
                status,
            },
            onLoad(x) {
                if (x.status == 200) {
                    fetch_orders(state.page)
                }
            },
        })
    }

    return (
        <div class='orders-fnd'>
            <div class='order-list'>
                {state.orders.map(o => (
                    <div class='order'>
                        <div class='icon'>
                            {o.kind} - {o.price} - {o.user.name}-{o.user.phone}
                        </div>
                        <Show when={o.status === 'wating'}>
                            <div class='actions'>
                                <Confact
                                    color='var(--red)'
                                    timer_ms={1e3}
                                    icon={BanIcon}
                                    onAct={() => update_order(o.id, 'refunded')}
                                />
                                <Confact
                                    color='var(--green)'
                                    timer_ms={1e3}
                                    icon={CircleCheckBigIcon}
                                    onAct={() => update_order(o.id, 'done')}
                                />
                            </div>
                        </Show>
                    </div>
                ))}
            </div>
        </div>
    )
}
