import { createStore } from 'solid-js/store'
import './style/orders.scss'
import { OrderModel, UserModel } from 'models'
import { useNavigate, useParams } from '@solidjs/router'
import { Component, Show, createEffect, onMount } from 'solid-js'
import { httpx } from 'shared'
import { BanIcon, CircleCheckBigIcon, UserIcon } from 'icons'
import { Confact, Copiable } from 'comps'

export default () => {
    const UP = useParams()
    const navigate = useNavigate()

    type OrderInfo = Omit<OrderModel, 'user'> & {
        user: UserModel
    }

    type State = {
        orders: OrderInfo[]
        user_show: number
        page: number
    }

    const [state, setState] = createStore<State>({
        orders: [],
        page: 0,
        user_show: 0,
    })

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
                }))

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
                {state.orders.map((o, i) => (
                    <div class='order'>
                        <div class='top'>
                            <div class='info'>
                                <span>{o.id}</span>
                                <span>{o.status}</span>
                                <span>{o.kind}</span>
                                <span>
                                    {(~~(o.price / 10)).toLocaleString()}
                                </span>

                                <User
                                    user={o.user}
                                    onShow={s => {
                                        setState({ user_show: s ? i : -1 })
                                    }}
                                    show={state.user_show == i}
                                />

                                <span>
                                    {new Date(
                                        o.timestamp * 1e3
                                    ).toLocaleString()}
                                </span>
                            </div>
                            <Show when={o.status === 'wating'}>
                                <div class='actions'>
                                    <Confact
                                        color='var(--red)'
                                        timer_ms={1e3}
                                        icon={BanIcon}
                                        onAct={() =>
                                            update_order(o.id, 'refunded')
                                        }
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
                        <div class='bottom'>
                            <div class='data'>
                                <Show when={o.data.contact}>
                                    <textarea
                                        disabled
                                        dir='auto'
                                        rows={o.data.contact.split('\n').length}
                                    >
                                        {o.data.contact}
                                    </textarea>
                                </Show>
                                <span>username: {o.data.username}</span>
                                <span>password: {o.data.password}</span>
                                <span>email: {o.data.email}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

type UserProps = {
    user: UserModel
    show: boolean
    onShow(show: boolean): void
}
const User: Component<UserProps> = P => {
    const CARD_HEIGHT = 420
    const PADDING = 10

    type State = { x: number; y: number }
    const [state, setState] = createStore<State>({ x: 0, y: 0 })

    function update_xy(rect: DOMRect) {
        setState({
            y: Math.min(
                Math.max(rect.y - CARD_HEIGHT / 2, PADDING),
                innerHeight - CARD_HEIGHT - PADDING
            ),
            x: rect.x + rect.width + PADDING,
        })
    }

    let dpy: HTMLDivElement
    onMount(() => update_xy(dpy.getBoundingClientRect()))

    return (
        <div class='user' classList={{ active: P.show }}>
            <div
                ref={dpy}
                class='user-dpy'
                onclick={e => {
                    update_xy(e.currentTarget.getBoundingClientRect())
                    P.onShow(!P.show)
                }}
            >
                <div class='img'>
                    <Show when={P.user.photo} fallback={<UserIcon />}>
                        <img src={`/record/${P.user.id}:${P.user.photo}`} />
                    </Show>
                </div>
                <span class='name'>{P.user.name || P.user.phone}</span>
            </div>
            <div
                class='user-info'
                style={{
                    left: state.x + 'px',
                    top: state.y + 'px',
                    height: CARD_HEIGHT + 'px',
                }}
            >
                <div class='img'>
                    <Show when={P.user.photo} fallback={<UserIcon />}>
                        <img src={`/record/${P.user.id}:${P.user.photo}`} />
                    </Show>
                </div>

                <div class='user-detail'>
                    <span>name: {P.user.name || '---'}</span>
                    <span>
                        phone: <Copiable text={P.user.phone} />
                    </span>
                    <span>
                        wallet: {(~~(P.user.wallet / 10)).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    )
}
