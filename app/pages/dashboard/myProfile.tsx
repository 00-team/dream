import { Special } from 'comps'
import { Component, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { self } from 'store/self'

import './style/profile.scss'

export const MyProfile: Component = props => {
    const [data, setdata] = createStore({
        img: '',
        name: '',
    })

    onMount(() => {
        setdata({
            img: self.user.photo,
            name: self.user.name,
        })
    })

    return (
        <section class='profile'>
            <div class='img-container'></div>
            <div class='name-container'>
                <input
                    type='text'
                    value={data.name}
                    placeholder='اسم شما...'
                    oninput={e => setdata({ name: e.currentTarget.value })}
                    class='title_small'
                    maxLength={256}
                />
            </div>
            <Special
                text='ذخیره'
                class='save-cta'
                onclick={() => alert('slm')}
            />
        </section>
    )
}
