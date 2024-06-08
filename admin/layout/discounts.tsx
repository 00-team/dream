import { useSearchParams } from '@solidjs/router'
import './style/discounts.scss'
import { createStore } from 'solid-js/store'
import { Component, Match, Show, createEffect, createMemo } from 'solid-js'
import { fmt_mdhm, fmt_parse_seconds, httpx } from 'shared'
import { DiscountModel } from 'models'
import { Copiable } from 'comps'
import {
    ChevronDownIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    HourglassIcon,
    PlusIcon,
    ShieldCheckIcon,
    ShieldXIcon,
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
                    <Discount discount={d} />
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
}
const Discount: Component<DiscountProps> = P => {
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
                    <button class='styled icon'>
                        <WrenchIcon />
                    </button>
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
    }
    const [state, setState] = createStore<State>({
        new_discount: true,
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
                            setState(s => ({ new_discount: !s.new_discount }))
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
                        items={[{ display: 'hi', idx: 0 }]}
                        multiple
                        onChange={v => console.log(v)}
                    />
                    <span>plan: </span>
                    <Select
                        items={[{ display: 'hi', idx: 0 }]}
                        onChange={v => console.log(v)}
                    />
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
