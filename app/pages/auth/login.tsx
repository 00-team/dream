import { GoBackIcon, PhoneIcon } from 'icons/login'
import { createStore } from 'solid-js/store'

import { useNavigate } from '@solidjs/router'
import { httpx } from 'shared'
import { createEffect, Show } from 'solid-js'
import { self, setSelf } from 'store/self'
import './style/login.scss'

let phoneRegex = /^(0|09|09[0-9]{1,9})$/

const Login = () => {
    type State = {
        stage: 'phone' | 'code'
        phone: string
        code: string
        error: string
        expires: number
    }
    const [state, setState] = createStore<State>({
        stage: 'phone',
        expires: 0,
        phone: '',
        code: '',
        error: '',
    })
    const nav = useNavigate()

    createEffect(() => {
        if (self.loged_in) nav('/')
    })

    function verification() {
        if (state.phone.length !== 11)
            return setState({ error: 'شماره تلفن خود را به درستی وارد کنید!' })

        if (state.phone[0] !== '0')
            return setState({
                error: 'شماره تلفن خود را با پیش شماره 0 وارد کنید',
            })

        if (!phoneRegex.test(state.phone))
            return alert('شماره تلفن خود را به درستی وارد کنید!')

        httpx({
            url: '/api/verification/',
            method: 'POST',
            json: {
                action: 'login',
                phone: state.phone,
            },
            onLoad(x) {
                if (x.status == 200) {
                    setState({ stage: 'code', expires: x.response.expires })
                } else {
                    setState({ error: x.response.message })
                }
            },
        })
    }

    function login() {
        if (state.code.length != 5) return

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
                    nav('/')
                } else {
                    setState({ error: x.response.message })
                }
            },
        })
    }

    return (
        <main class='login'>
            <iframe src='https://my.spline.design/untitled-51a258c8798e70e51855f9dd800ffa1c/'></iframe>
            <form
                onsubmit={e => {
                    e.preventDefault()
                    if (state.stage === 'phone') verification()
                    else login()
                }}
                class='login-wrapper'
            >
                <button
                    class='back-icon'
                    onclick={() => setState({ stage: 'phone' })}
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

                    <div class='inp code'>
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

                        <p class='title_smaller desc'>
                            کد 5 رقمی برای شماره {state.phone} ارسال شد.
                        </p>
                    </div>
                </div>

                <button class='title_smaller cta' type={'submit'}>
                    <Show when={state.stage == 'phone'} fallback='تایید کد'>
                        ارسال کد
                    </Show>
                </button>
            </form>
        </main>
    )
}

export default Login
