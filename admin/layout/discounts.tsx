import { useSearchParams } from '@solidjs/router'
import './style/discounts.scss'
import { createStore, produce } from 'solid-js/store'
import { Component, Show, createEffect, onMount } from 'solid-js'
import { fmt_mdhm, httpx } from 'shared'
import { DiscountModel, ProductModel } from 'models'
import { Confact, Copiable } from 'comps'
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    HourglassIcon,
    PlusIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    TrashIcon,
    WrenchIcon,
    XIcon,
} from 'icons'
import { Select } from 'comps'

export default () => {
    type State = {
        discounts: DiscountModel[]
        page: number
    }
    const [params, setParams] = useSearchParams()

    const [state, setState] = createStore<State>({
        discounts: [],
        page: 0,
    })

    createEffect(() => fetch_discounts(parseInt(params.page || '0') || 0))

    function fetch_discounts(page: number) {
        setParams({ page })
        setState({ page })

        httpx({
            url: '/api/admin/discounts/',
            params: { page },
            method: 'GET',
            onLoad(x) {
                if (x.status != 200) return
                setState({ discounts: x.response, page })
            },
        })
    }

    return (
        <div class='discounts-fnd'>
            <div class='discount-list'>
                <NewDiscount onNew={() => fetch_discounts(0)} />
                {state.discounts.map(d => (
                    <Discount
                        discount={d}
                        onUpdate={() => fetch_discounts(state.page)}
                    />
                ))}
            </div>
            <Show when={state.page != 0 || state.discounts.length >= 32}>
                <div class='actions'>
                    <button
                        class='styled'
                        disabled={state.page <= 0}
                        onClick={() => fetch_discounts(state.page - 1)}
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        class='styled'
                        disabled={state.discounts.length < 32}
                        onClick={() => fetch_discounts(state.page + 1)}
                    >
                        <ChevronRightIcon />
                    </button>
                </div>
            </Show>
        </div>
    )
}

type DiscountProps = {
    discount: DiscountModel
    onUpdate(): void
}
const Discount: Component<DiscountProps> = P => {
    type State = { loading: boolean }
    const [state, setState] = createStore<State>({ loading: false })

    function discount_delete() {
        setState({ loading: true })
        httpx({
            url: `/api/admin/discounts/${P.discount.id}/`,
            method: 'DELETE',
            onError() {
                setState({ loading: false })
            },
            onLoad(x) {
                setState({ loading: false })
                if (x.status != 200) return
                P.onUpdate()
            },
        })
    }

    function discount_update() {
        setState({ loading: true })
        httpx({
            url: `/api/admin/discounts/${P.discount.id}/`,
            method: 'PATCH',
            json: {
                disabled: !P.discount.disabled,
            },
            onError() {
                setState({ loading: false })
            },
            onLoad(x) {
                setState({ loading: false })
                if (x.status != 200) return
                P.onUpdate()
            },
        })
    }

    return (
        <div class='discount'>
            <div class='top'>
                <div class='info'>
                    <span>{P.discount.id}</span>
                    <span
                        class='disabled'
                        classList={{ bad: P.discount.disabled }}
                    >
                        <Show
                            when={P.discount.disabled}
                            fallback={<ShieldCheckIcon />}
                        >
                            <ShieldXIcon />
                        </Show>
                    </span>
                    <Copiable text={P.discount.code} />
                    <span>{P.discount.amount}%</span>
                    <span>
                        {P.discount.uses}/{P.discount.max_uses || '∞'}
                    </span>

                    <Show when={P.discount.kind}>
                        <span>
                            produc: {P.discount.kind}.{P.discount.plan}
                        </span>
                    </Show>
                    <Show when={P.discount.expires}>
                        <span>
                            <HourglassIcon />
                            {fmt_mdhm(P.discount.expires)}
                        </span>
                    </Show>
                </div>
                <div class='actions'>
                    <Confact
                        disabled={state.loading}
                        icon={TrashIcon}
                        color='var(--red)'
                        onAct={discount_delete}
                        timer_ms={1500}
                    />
                    <Confact
                        disabled={state.loading}
                        icon={WrenchIcon}
                        color={
                            P.discount.disabled
                                ? 'var(--green)'
                                : 'var(--yellow)'
                        }
                        onAct={discount_update}
                        timer_ms={500}
                    />
                </div>
            </div>
        </div>
    )
}

type NewDiscountProps = {
    onNew(): void
}
const NewDiscount: Component<NewDiscountProps> = P => {
    type State = Omit<DiscountModel, 'id' | 'uses' | 'disabled' | 'expires'> & {
        new_discount: boolean
        set_expires: boolean
        expires: {
            months: number
            days: number
            hours: number
            minutes: number
        }
        products: { [k: string]: ProductModel }
    }
    const [state, setState] = createStore<State>({
        new_discount: false,
        code: '',
        amount: 0,
        max_uses: null,
        set_expires: false,
        expires: {
            months: 0,
            days: 0,
            hours: 0,
            minutes: 0,
        },
        kind: null,
        plan: null,
        products: {},
    })

    onMount(() => {
        httpx({
            url: '/api/products/',
            method: 'GET',
            onLoad(x) {
                if (x.status != 200) return
                setState({ products: x.response })
            },
        })
    })

    function add() {
        let expires: number | null = null
        if (state.set_expires) {
            expires =
                state.expires.months * 2592000 +
                state.expires.days * 86400 +
                state.expires.hours * 3600 +
                state.expires.minutes * 60
        }

        httpx({
            url: '/api/admin/discounts/',
            method: 'POST',
            json: {
                code: state.code,
                amount: state.amount,
                kind: state.kind,
                plan: state.plan,
                expires: expires,
                max_uses: state.max_uses,
            },
            onLoad(x) {
                if (x.status != 200) return
                P.onNew()
            },
        })
    }

    return (
        <div class='new-discount'>
            <div class='top'>
                <span>New Discount</span>
                <div class='actions'>
                    <Show when={state.new_discount && state.code}>
                        <button class='add-btn styled icon' onClick={add}>
                            <PlusIcon />
                        </button>
                    </Show>
                    <button
                        class='styled icon'
                        onClick={() =>
                            setState(
                                produce(s => {
                                    s.new_discount = !s.new_discount
                                    if (!s.new_discount) {
                                        s.kind = null
                                        s.plan = null
                                    }
                                })
                            )
                        }
                    >
                        <Show
                            when={state.new_discount}
                            fallback={<ChevronDownIcon />}
                        >
                            <ChevronUpIcon />
                        </Show>
                    </button>
                </div>
            </div>
            <Show when={state.new_discount}>
                <div class='bottom'>
                    <span>Code: </span>
                    <input
                        maxLength={255}
                        class='styled'
                        placeholder='code'
                        value={state.code}
                        onInput={e => {
                            let code = e.currentTarget.value.slice(0, 255)
                            e.currentTarget.value = code
                            setState({ code })
                        }}
                    />
                    <span>Amount: </span>
                    <input
                        type='number'
                        max={100}
                        min={0}
                        class='styled'
                        placeholder='69%'
                        value={state.amount}
                        onInput={e => {
                            let amount = parseInt(e.currentTarget.value) || 0
                            amount = Math.max(Math.min(amount, 100), 0)
                            e.currentTarget.value = amount.toString()
                            setState({ amount })
                        }}
                    />
                    <span>kind: </span>
                    <Select
                        items={[{ display: '---', idx: -1, key: null }].concat(
                            Object.entries(state.products).map(
                                ([key, v], idx) => ({
                                    display: v.name,
                                    idx,
                                    key,
                                })
                            )
                        )}
                        onChange={v => setState({ kind: v[0].key })}
                    />
                    <Show when={state.kind}>
                        <span>plan: </span>
                        <Select
                            items={[
                                { display: '---', idx: -1, key: null },
                            ].concat(
                                Object.entries(
                                    state.products[state.kind].plans
                                ).map(([key, v], idx) => ({
                                    display: v[1],
                                    idx,
                                    key,
                                }))
                            )}
                            onChange={v => setState({ plan: v[0].key })}
                        />
                    </Show>
                    <span>Expires: </span>
                    <div class='row expires'>
                        <button
                            class='styled icon remove'
                            onClick={() =>
                                setState({
                                    set_expires: false,
                                    expires: {
                                        months: 0,
                                        days: 0,
                                        hours: 0,
                                        minutes: 0,
                                    },
                                })
                            }
                        >
                            <XIcon />
                        </button>
                        <input
                            type='number'
                            class='styled'
                            placeholder='Months'
                            value={state.expires.months}
                            min={0}
                            max={1600}
                            onInput={e => {
                                let v = parseInt(e.currentTarget.value) || 0
                                v = Math.max(Math.min(v, 1600), 0)
                                e.currentTarget.value = v.toString()
                                setState(s => ({
                                    expires: { ...s.expires, months: v },
                                    set_expires: true,
                                }))
                            }}
                        />
                        <input
                            type='number'
                            class='styled'
                            placeholder='Days'
                            value={state.expires.days}
                            min={0}
                            max={30}
                            onInput={e => {
                                let v = parseInt(e.currentTarget.value) || 0
                                v = Math.max(Math.min(v, 30), 0)
                                e.currentTarget.value = v.toString()
                                setState(s => ({
                                    expires: { ...s.expires, days: v },
                                    set_expires: true,
                                }))
                            }}
                        />
                        <input
                            type='number'
                            class='styled'
                            placeholder='Hours'
                            value={state.expires.hours}
                            min={0}
                            max={24}
                            onInput={e => {
                                let v = parseInt(e.currentTarget.value) || 0
                                v = Math.max(Math.min(v, 24), 0)
                                e.currentTarget.value = v.toString()
                                setState(s => ({
                                    expires: { ...s.expires, hours: v },
                                    set_expires: true,
                                }))
                            }}
                        />
                        <input
                            type='number'
                            class='styled'
                            placeholder='Hours'
                            value={state.expires.minutes}
                            min={0}
                            max={60}
                            onInput={e => {
                                let v = parseInt(e.currentTarget.value) || 0
                                v = Math.max(Math.min(v, 60), 0)
                                e.currentTarget.value = v.toString()
                                setState(s => ({
                                    expires: { ...s.expires, minutes: v },
                                    set_expires: true,
                                }))
                            }}
                        />
                        <Show when={state.set_expires} fallback='(null)'>
                            <span>
                                Months {state.expires.months} & Days{' '}
                                {state.expires.days} &{' '}
                                {state.expires.hours
                                    .toString()
                                    .padStart(2, '0')}
                                :
                                {state.expires.minutes
                                    .toString()
                                    .padStart(2, '0')}
                            </span>
                        </Show>
                    </div>
                    <span>Max Uses: </span>
                    <div class='row'>
                        <button
                            class='styled icon remove'
                            onClick={() => setState({ max_uses: null })}
                        >
                            <XIcon />
                        </button>
                        <input
                            type='number'
                            class='styled'
                            min={0}
                            max={4294967295}
                            placeholder='420'
                            value={state.max_uses}
                            onInput={e => {
                                if (!e.currentTarget.value) {
                                    setState({ max_uses: null })
                                    return
                                }
                                let v = parseInt(e.currentTarget.value) || 0
                                v = Math.max(Math.min(v, 4294967295), 0)
                                e.currentTarget.value = v.toString()
                                setState({ max_uses: v })
                            }}
                        />
                    </div>
                </div>
            </Show>
        </div>
    )
}
