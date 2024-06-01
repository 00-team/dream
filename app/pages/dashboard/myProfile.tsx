import { addAlert, Special } from 'comps'
import { Component, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { self } from 'store/self'

import './style/profile.scss'

const IMAGE_MIMETYPE = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webm',
]

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

    function SaveInfo() {
        if (!data.img || !data.name) {
            addAlert({
                type: 'error',
                timeout: 5,
                content: 'لطفا تمام فیلد ها را پر کنید.',
                subject: 'خطا!',
            })
            return
        }

        if (data.img == self.user.phone && data.name == self.user.name) return
    }

    return (
        <section class='profile'>
            <label for='img-inp' class='img-container'>
                <input
                    type='file'
                    id='img-inp'
                    accept='.jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
                    onchange={e => {
                        if (!e.target.files || !e.target.files[0]) return

                        const file = e.target.files[0]

                        if (!IMAGE_MIMETYPE.includes(file.type)) return

                        const url = URL.createObjectURL(file)

                        setdata({
                            img: url,
                        })
                    }}
                />
                <img
                    src={
                        data.img ||
                        '/static/image/dashboard/default-avatar.webp'
                    }
                    draggable={false}
                    class='img'
                    alt=''
                />
            </label>
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
            <Special text='ذخیره' class='save-cta' onclick={() => SaveInfo()} />
        </section>
    )
}
