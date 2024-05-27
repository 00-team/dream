import { createStore } from 'solid-js/store'

const [popup, setpopup] = createStore({
    show: false,
})

export { popup, setpopup }
