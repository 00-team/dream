import { PhoneIcon } from 'icons/login'
import { Component } from 'solid-js'
import { createStore } from 'solid-js/store'

import './style/login.scss'

type loginState = {
    stage: 'phone' | 'code'
    phone: ''
    code: ''
}

const Login: Component = props => {
    const [login, setlogin] = createStore<loginState>({
        stage: 'phone',
        phone: '',
        code: '',
    })
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
                        type='number'
                        inputMode={'numeric'}
                        class='phone-inp title_small'
                        placeholder='09123456789'
                    />
                </div>

                <button class='title_smaller cta'>ارسال کد</button>
            </div>
        </main>
    )
}

export default Login
