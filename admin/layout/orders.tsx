import { SetStoreFunction, createStore } from 'solid-js/store'
import './style/orders.scss'
import { OrderModel, UserModel } from 'models'
import { useNavigate, useParams } from '@solidjs/router'
import { Component, Show, createEffect, createSignal, onMount } from 'solid-js'
import { httpx } from 'shared'
import {
    BanIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    CircleCheckBigIcon,
    UserIcon,
    XIcon,
} from 'icons'
import { Confact, Copiable } from 'comps'

type OrderInfo = Omit<OrderModel, 'user'> & { user: UserModel }
type UpdateOrderStatus = Exclude<OrderModel['status'], 'wating'>

type OrdersState = {
    orders: OrderInfo[]
    user_show: number
    page: number
}

export default () => {
    const UP = useParams()
    const navigate = useNavigate()

    const [state, setState] = createStore<OrdersState>({
        orders: [],
        page: 0,
        user_show: -1,
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

    function update_order(id: number, status: UpdateOrderStatus) {
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
                    <Order
                        order={o}
                        idx={i}
                        update={update_order}
                        state={state}
                        setState={setState}
                    />
                ))}
            </div>
        </div>
    )
}

type OrderProps = {
    order: OrderInfo
    idx: number
    update(id: number, status: UpdateOrderStatus): void
    state: OrdersState
    setState: SetStoreFunction<OrdersState>
}
const Order: Component<OrderProps> = P => {
    const [show_data, setShowData] = createSignal(P.order.status == 'wating')

    return (
        <div class='order'>
            <div class='top'>
                <div class='info'>
                    <span>{P.order.id}</span>
                    <span>{P.order.status}</span>
                    <span>{P.order.kind}</span>
                    <span>{(~~(P.order.price / 10)).toLocaleString()}</span>

                    <User
                        user={P.order.user}
                        onShow={s => {
                            P.setState({ user_show: s ? P.idx : -1 })
                        }}
                        show={P.state.user_show == P.idx}
                    />

                    <span>
                        {new Date(P.order.timestamp * 1e3).toLocaleString()}
                    </span>
                </div>
                <div class='actions'>
                    <button
                        class='btn-show-data styled icon'
                        onclick={() => setShowData(s => !s)}
                    >
                        <Show when={show_data()} fallback={<ChevronDownIcon />}>
                            <ChevronUpIcon />
                        </Show>
                    </button>
                    <Show when={P.order.status === 'wating'}>
                        <Confact
                            color='var(--red)'
                            timer_ms={1e3}
                            icon={BanIcon}
                            onAct={() => P.update(P.order.id, 'refunded')}
                        />
                        <Confact
                            color='var(--green)'
                            timer_ms={1e3}
                            icon={CircleCheckBigIcon}
                            onAct={() => P.update(P.order.id, 'done')}
                        />
                    </Show>
                </div>
            </div>
            <div class='bottom'>
                <div class='data' classList={{ show: show_data() }}>
                    <Show when={P.order.data.contact}>
                        <textarea
                            disabled
                            dir='auto'
                            rows={P.order.data.contact.split('\n').length}
                        >
                            {P.order.data.contact}
                        </textarea>
                    </Show>
                    <span>username: {P.order.data.username}</span>
                    <span>password: {P.order.data.password}</span>
                    <span>email: {P.order.data.email}</span>
                </div>
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
                        <img
                            draggable={false}
                            src={`/record/${P.user.id}:${P.user.photo}`}
                        />
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
                <button
                    class='btn-close styled icon'
                    onclick={() => P.onShow(false)}
                >
                    <XIcon />
                </button>

                <div class='img'>
                    <Show when={P.user.photo} fallback={<UserIcon />}>
                        <img
                            draggable={false}
                            src={`/record/${P.user.id}:${P.user.photo}`}
                        />
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
