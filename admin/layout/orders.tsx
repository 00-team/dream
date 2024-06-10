import { SetStoreFunction, createStore } from 'solid-js/store'
import './style/orders.scss'
import { OrderModel, UserModel } from 'models'
import { useSearchParams } from '@solidjs/router'
import {
    Component,
    JSX,
    Show,
    createEffect,
    createSignal,
    onMount,
} from 'solid-js'
import { httpx } from 'shared'
import {
    BanIcon,
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    CircleCheckBigIcon,
    HourglassIcon,
    UserIcon,
    XIcon,
} from 'icons'
import { Confact, Copiable, Fanel } from 'comps'

type OrderInfo = Omit<OrderModel, 'user'> & { user: UserModel | undefined }
type UpdateOrderStatus = Exclude<OrderModel['status'], 'wating'>

type OrdersState = {
    orders: OrderInfo[]
    user_show: number
    page: number
}

export default () => {
    const [params, setParams] = useSearchParams()

    const [state, setState] = createStore<OrdersState>({
        orders: [],
        page: 0,
        user_show: -1,
    })

    createEffect(() => fetch_orders(parseInt(params.page || '0') || 0))

    function fetch_orders(page: number) {
        setParams({ page })
        setState({ page })

        httpx({
            url: '/api/admin/orders/',
            params: { page },
            method: 'GET',
            onLoad(x) {
                if (x.status != 200) return

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
            <div
                class='order-list'
                classList={{ message: state.orders.length == 0 }}
            >
                <Show when={state.orders.length == 0}>No Order</Show>
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

            <Show when={state.page != 0 || state.orders.length >= 32}>
                <div class='actions'>
                    <button
                        class='styled'
                        disabled={state.page <= 0}
                        onClick={() => fetch_orders(state.page - 1)}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        class='styled'
                        disabled={state.orders.length < 32}
                        onClick={() => fetch_orders(state.page + 1)}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </Show>
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

    const STATUS_ICON: { [k in OrderModel['status']]: () => JSX.Element } = {
        wating: HourglassIcon,
        done: CircleCheckBigIcon,
        refunded: BanIcon,
    }

    return (
        <div class='order'>
            <div class='top'>
                <div class='info'>
                    <span>{P.order.id}</span>
                    <span class='status' classList={{ [P.order.status]: true }}>
                        {STATUS_ICON[P.order.status]()}
                    </span>
                    <span>{P.order.kind}</span>
                    <span>{(~~(P.order.price / 10)).toLocaleString()}</span>

                    <Show when={P.order.user} fallback={'no user'}>
                        <User
                            user={P.order.user}
                            onShow={s => {
                                P.setState({ user_show: s ? P.idx : -1 })
                            }}
                            show={P.state.user_show == P.idx}
                        />
                    </Show>

                    <span>
                        {new Date(P.order.timestamp * 1e3).toLocaleString()}
                    </span>
                </div>
                <div class='actions'>
                    <Show when={Object.keys(P.order.data).length != 0}>
                        <button
                            class='btn-show-data styled icon'
                            onclick={() => setShowData(s => !s)}
                        >
                            <Show
                                when={show_data()}
                                fallback={<ChevronDownIcon />}
                            >
                                <ChevronUpIcon />
                            </Show>
                        </button>
                    </Show>
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
                    <Show when={P.order.data.detail}>
                        <textarea
                            disabled
                            dir='auto'
                            rows={P.order.data.detail.split('\n').length}
                        >
                            {P.order.data.detail}
                        </textarea>
                    </Show>
                    {Object.entries(P.order.data)
                        .filter(([k]) => k != 'detail')
                        .map(([k, v]) => (
                            <span>
                                {k}: <Copiable text={v} />
                            </span>
                        ))}
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
    const CARD_HEIGHT = 440
    const PADDING = 10

    type State = { x: number; y: number; send_sms_fanel: boolean }
    const [state, setState] = createStore<State>({
        x: 0,
        y: 0,
        send_sms_fanel: false,
    })

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
    let sms_body: HTMLTextAreaElement
    onMount(() => update_xy(dpy.getBoundingClientRect()))

    function send_sms() {
        httpx({
            url: '/api/admin/orders/sms/',
            method: 'POST',
            json: {
                phone: P.user.phone,
                text: sms_body.value,
            },
        })
    }

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
                            loading='lazy'
                            decoding='async'
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
                            loading='lazy'
                            decoding='async'
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
                    <button
                        class='btn-send-sms styled'
                        onClick={() => setState({ send_sms_fanel: true })}
                    >
                        Send SMS
                    </button>
                </div>
            </div>

            <Fanel
                open={state.send_sms_fanel}
                onClose={() => setState({ send_sms_fanel: false })}
            >
                <div class='send-sms-form'>
                    <h2>sending sms to: {P.user.phone}</h2>
                    <textarea
                        ref={sms_body}
                        dir='auto'
                        placeholder='sms text'
                    ></textarea>
                    <button class='styled' onclick={send_sms}>
                        Send
                    </button>
                </div>
            </Fanel>
        </div>
    )
}
