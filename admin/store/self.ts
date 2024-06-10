import { UserModel } from 'models'
import { httpx } from 'shared'
import { createEffect, createRoot } from 'solid-js'

import { createStore } from 'solid-js/store'

type SelfModel = {
    user: UserModel
    loged_in: boolean
    fetch: boolean
}

async function get_default(): Promise<SelfModel> {
    try {
        const result: any = await new Promise((resolve, reject) => {
            httpx({
                url: '/api/user/',
                method: 'GET',
                reject,
                show_messages: false,
                onLoad(x) {
                    if (x.status != 200) return reject()
                    resolve(x.response)
                },
            })
        })

        return {
            user: result,
            loged_in: true,
            fetch: false,
        }
    } catch {}

    return {
        loged_in: false,
        fetch: true,
        user: {
            id: 0,
            name: '',
            wallet: 0,
            in_hold: 0,
            token: '',
            photo: null,
            admin: false,
            banned: false,
            phone: '',
        },
    }
}

const [self, setSelf] = createStore(await get_default())

createRoot(() => {
    createEffect(() => {
        if (!self.fetch && self.loged_in) return

        get_default().then(result => setSelf(result))
    })
})

export { self, setSelf }
