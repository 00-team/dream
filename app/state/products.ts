import { createStore } from 'solid-js/store'

const [popup, setpopup] = createStore({
    show: false,
    title: '',
    img: '',
})

export { popup, setpopup }
