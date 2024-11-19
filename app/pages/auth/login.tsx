import { GoBackIcon, PhoneIcon } from 'icons/login'
import { createStore } from 'solid-js/store'

import { useNavigate } from '@solidjs/router'
import { httpx } from 'shared'
import { createEffect, onMount, Show } from 'solid-js'
import { self, setSelf } from 'store/self'
import './style/login.scss'

import { Application } from '@splinetool/runtime'

import logo from 'assets/image/logo.png'

let phoneRegex = /^(0|09|09[0-9]{1,9})$/

const Login = () => {
    type State = {
        stage: 'phone' | 'code'
        phone: string
        code: string
        error: string
        expires: number
        loading: boolean
    }
    const [state, setState] = createStore<State>({
        stage: 'phone',
        expires: 0,
        phone: '',
        code: '',
        error: '',
        loading: false,
    })
    const nav = useNavigate()

    createEffect(() => {
        if (self.loged_in) nav('/dashboard')
    })

    function verification() {
        if (state.phone.length !== 11)
            return setState({
                error: 'شماره تلفن خود را به درستی وارد کنید!',
                loading: false,
            })

        if (state.phone[0] !== '0')
            return setState({
                error: 'شماره تلفن خود را با پیش شماره 0 وارد کنید',
                loading: false,
            })

        if (!phoneRegex.test(state.phone))
            return setState({
                error: 'شماره تلفن خود را به درستی وارد کنید!',
                loading: false,
            })

        httpx({
            url: '/api/verification/',
            method: 'POST',
            json: {
                action: 'login',
                phone: state.phone,
            },
            onLoad(x) {
                if (x.status == 200) {
                    setState({
                        stage: 'code',
                        loading: false,
                        expires: x.response.expires,
                    })
                } else {
                    setState({ error: x.response.message, loading: false })
                }
            },
        })
    }

    function login() {
        if (state.code.length != 5)
            return setState({
                loading: false,
                error: 'کد را به درستی وارد کنید!',
            })

        httpx({
            url: '/api/user/login/',
            method: 'POST',
            json: {
                code: state.code,
                phone: state.phone,
            },
            onLoad(x) {
                if (x.status == 200) {
                    setSelf({ loged_in: true, fetch: false, user: x.response })
                    setState({ loading: false })
                    nav('/dashboard')
                } else {
                    setState({ error: x.response.message, loading: false })
                }
            },
        })
    }

    return (
        <main class='login'>
            <form
                onsubmit={e => {
                    e.preventDefault()
                    if (state.loading) return

                    setState({ loading: true })

                    if (state.stage === 'phone') verification()
                    else login()
                }}
                class='login-wrapper'
            >
                <button
                    class='back-icon'
                    type={'reset'}
                    onclick={() =>
                        setState({ stage: 'phone', phone: '', error: '' })
                    }
                >
                    <GoBackIcon size={30} />
                </button>
                <h2 class='title'>Dream Pay</h2>
                <h3 class='title_small'>ورود</h3>

                <div class='inps' classList={{ code: state.stage === 'code' }}>
                    <div
                        class='inp phone'
                        classList={{ error: state.error !== '' }}
                    >
                        <h3 class='holder title_smaller'>
                            <PhoneIcon />
                            شماره تلفن
                        </h3>
                        <input
                            class='phone-inp title_small'
                            type={'number'}
                            inputmode={'numeric'}
                            maxlength='11'
                            classList={{ inpError: state.error !== '' }}
                            placeholder='مثال: 09123456789'
                            value={state.phone}
                            dir='ltr'
                            onInput={e => {
                                if (state.error) setState({ error: '' })
                                setState({ phone: e.currentTarget.value })
                            }}
                        />
                        {state.error && (
                            <p class='error title_smaller'>{state.error}</p>
                        )}
                    </div>

                    <div
                        class='inp code'
                        classList={{ error: state.error !== '' }}
                    >
                        <h3 class='holder title_smaller'>
                            <PhoneIcon />
                            کد فعالسازی
                        </h3>
                        <input
                            class='phone-inp title_small'
                            type={'number'}
                            inputmode={'numeric'}
                            maxlength='11'
                            classList={{ inpError: state.error !== '' }}
                            maxLength={5}
                            placeholder='مثال: 12345'
                            value={state.code}
                            dir='ltr'
                            onInput={e => {
                                if (state.error) setState({ error: '' })
                                setState({ code: e.currentTarget.value })
                            }}
                        />
                        {state.error && (
                            <p class='error title_smaller'>{state.error}</p>
                        )}

                        <p class='title_smaller desc'>
                            کد 5 رقمی برای شماره {state.phone} ارسال شد.
                        </p>
                    </div>
                </div>

                <button class='title_smaller cta' type={'submit'}>
                    {state.loading && (
                        <div class='loading-wrapper'>
                            <img
                                loading='lazy'
                                decoding='async'
                                draggable={false}
                                src={logo}
                                alt=''
                            />
                        </div>
                    )}
                    <Show when={state.stage == 'phone'} fallback='ورود'>
                        ارسال کد
                    </Show>
                </button>
            </form>
        </main>
    )
}

export default Login
