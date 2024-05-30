import { PhoneIcon } from 'icons/login'
import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'

import './style/login.scss'

type loginState = {
    stage: 'phone' | 'code'
    phone: string
    code: string
    error: string
}

let phoneRegex = /^(0|09|09[0-9]{1,9})$/

const Login: Component = props => {
    const [login, setlogin] = createStore<loginState>({
        stage: 'phone',
        phone: '',
        code: '',
        error: '',
    })

    function CheckPhone() {
        if (login.phone.length !== 11)
            return setlogin({ error: 'شماره تلفن خود را به درستی وارد کنید!' })

        if (login.phone[0] !== '0')
            return setlogin({
                error: 'شماره تلفن خود را با پیش شماره 0 وارد کنید',
            })

        if (!phoneRegex.test(login.phone))
            return alert('شماره تلفن خود را به درستی وارد کنید!')

        return setlogin({ stage: 'code' })
    }

    function CheckCode() {}

    return (
        <main class='login'>
            <iframe src='https://my.spline.design/untitled-51a258c8798e70e51855f9dd800ffa1c/'></iframe>
            <div class='login-wrapper'>
                <h2 class='title'>Dream Pay</h2>
                <h3 class='title_small'>ورود</h3>

                <div class='inp phone'>
                    <h3 class='holder title_smaller'>
                        <PhoneIcon />
                        شماره تلفن
                    </h3>
                    <input
                        class='phone-inp title_small'
                        type={'number'}
                        inputmode={'numeric'}
                        maxlength='11'
                        classList={{ inpError: login.error !== '' }}
                        placeholder='مثال: 09123456789'
                        value={login.phone}
                        oninput={e => {
                            if (login.error) setlogin({ error: '' })

                            return setlogin({
                                phone: e.currentTarget.value,
                            })
                        }}
                    />
                </div>

                <button
                    class='title_smaller cta'
                    onclick={() => {
                        if (login.stage === 'phone') CheckPhone()
                        else CheckCode()
                    }}
                >
                    ارسال کد
                </button>
            </div>
        </main>
    )
}

export default Login
