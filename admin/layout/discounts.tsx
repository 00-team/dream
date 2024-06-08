import { useSearchParams } from '@solidjs/router'
import './style/discounts.scss'
import { createStore } from 'solid-js/store'
import { Component, Show, createEffect } from 'solid-js'
import { fmt_mdhm, httpx } from 'shared'
import { DiscountModel } from 'models'
import { Copiable } from 'comps'
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    HourglassIcon,
    ShieldCheckIcon,
    ShieldXIcon,
    WrenchIcon,
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
                <NewDiscount />
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

const NewDiscount = () => {
    return (
        <div class='new-discount'>
            <span>Code: </span>
            <input maxLength={255} class='styled' placeholder='code' />
            <span>Amount: </span>
            <input type='number' max={100} class='styled' placeholder='69%' />
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
            <input type='number' class='styled' placeholder='in seconds' />
            <span>Max Uses: </span>
            <input type='number' class='styled' placeholder='420' />
        </div>
    )
}
