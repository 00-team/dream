import { addAlert, Special } from 'comps'
import { CrossIcon } from 'icons/home'
import { httpx } from 'shared'
import { Component, onMount } from 'solid-js'
import { createStore } from 'solid-js/store'
import { self, setSelf } from 'store/self'

import './style/profile.scss'

const IMAGE_MIMETYPE = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webm',
]

export const  Profile: Component = props => {
    type dataType = {
        name: string
        img: string
    }

    const [data, setdata] = createStore<dataType>({
        name: '',
        img: '',
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

        if (data.name == self.user.name) return

        httpx({
            url: '/api/user/',
            method: 'PATCH',
            json: {
                name: data.name,
            },
            onLoad(x) {
                if (x.status == 200) {
                    setSelf({ loged_in: true, fetch: false, user: x.response })
                    addAlert({
                        type: 'success',
                        timeout: 5,
                        content: 'نام شما با موفقیت به روز شد',
                        subject: 'موفق!',
                    })
                } else {
                    addAlert({
                        type: 'error',
                        timeout: 5,
                        content: 'مشکلی پیش امده کمی بعد دوباره تلاش کنید.',
                        subject: 'خطا!',
                    })
                }
            },
        })
    }

    return (
        <section class='profile'>
            <div class='img-wrapper'>
                <div
                    class='remove-img icon'
                    role='button'
                    onclick={() => {
                        httpx({
                            url: '/api/user/photo/',
                            method: 'DELETE',
                            onLoad(x) {
                                if (x.status == 200) {
                                    setdata({
                                        img: '',
                                    })
                                    setSelf({
                                        user: {
                                            ...self.user,
                                            photo: '',
                                        },
                                    })
                                    addAlert({
                                        type: 'success',
                                        timeout: 5,
                                        content: 'عکس شما با موفقیت به روز شد',
                                        subject: 'موفق!',
                                    })
                                } else {
                                    addAlert({
                                        type: 'error',
                                        timeout: 5,
                                        content:
                                            'مشکلی پیش امده کمی بعد دوباره تلاش کنید.',
                                        subject: 'خطا!',
                                    })
                                }
                            },
                        })
                    }}
                >
                    <CrossIcon />
                </div>
                <label for='img-inp' class='img-container'>
                    <input
                        type='file'
                        id='img-inp'
                        accept='.jpg, .jpeg, .png, image/jpg, image/jpeg, image/png'
                        onchange={e => {
                            if (!e.target.files || !e.target.files[0]) return

                            const file = e.target.files[0]

                            if (!IMAGE_MIMETYPE.includes(file.type))
                                return addAlert({
                                    type: 'error',
                                    timeout: 5,
                                    content: 'فرمت واردی باید عکس باشد!',
                                    subject: 'خطا!',
                                })

                            const fd = new FormData()
                            fd.set('photo', file)

                            const url = URL.createObjectURL(file)

                            setdata({
                                img: url,
                            })

                            httpx({
                                url: '/api/user/photo/',
                                method: 'PUT',
                                data: fd,
                                onLoad(x) {
                                    if (x.status == 200) {
                                        setSelf({
                                            loged_in: true,
                                            fetch: false,
                                            user: x.response,
                                        })
                                        addAlert({
                                            type: 'success',
                                            timeout: 5,
                                            content:
                                                'عکس شما با موفقیت به روز شد',
                                            subject: 'موفق!',
                                        })
                                    } else {
                                        addAlert({
                                            type: 'error',
                                            timeout: 5,
                                            content:
                                                'مشکلی پیش امده کمی بعد دوباره تلاش کنید.',
                                            subject: 'خطا!',
                                        })
                                    }
                                },
                            })
                        }}
                    />
                    <img
                        src={
                            self.user.photo
                                ? `/record/${self.user.id}:${self.user.photo}`
                                : '/static/image/dashboard/default-avatar.webp'
                        }
                        draggable={false}
                        class='img'
                        alt=''
                    />
                </label>
            </div>

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
