import { UserIcon } from 'icons'
import { Component, Show } from 'solid-js'
import { self } from 'store/self'

import './style/dashboard.scss'

const Dashboard: Component = props => {
    // const nav = useNavigate()

    // createEffect(() => {
    //     if (!self.loged_in) nav('/')
    // })
    return (
        <main class='dashboard'>
            <aside class='sidebar'>
                <div class='avatar'>
                    <div class='profile-avatar'>
                        <Show when={self.user.photo} fallback={<UserIcon />}>
                            <img
                                draggable={false}
                                loading='lazy'
                                decoding='async'
                                src={`/record/${self.user.id}:${self.user.photo}`}
                            />
                        </Show>
                    </div>
                    <div class='name-avatar title_small'>
                        <Show
                            when={self.user.name}
                            fallback={<span>خطا!</span>}
                        >
                            <h2>{self.user.name}</h2>
                        </Show>
                    </div>
                </div>
                <div class='links'></div>
                <div class='logout'></div>
            </aside>
            <aside class='wrapper'></aside>
        </main>
    )
}

export default Dashboard
