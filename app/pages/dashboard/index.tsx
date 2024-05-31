import { Component } from 'solid-js'

import './style/dashboard.scss'

const Dashboard: Component = props => {
    // const nav = useNavigate()

    // createEffect(() => {
    //     if (!self.loged_in) nav('/')
    // })
    return (
        <main class='dashboard'>
            <aside class='sidebar'></aside>
            <aside class='wrapper'></aside>
        </main>
    )
}

export default Dashboard
