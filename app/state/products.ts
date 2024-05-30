import { createStore } from 'solid-js/store'

const [popup, setpopup] = createStore({
    show: false,
    title: '',
    category: '',
    img: '',
    color: '',
})

export { popup, setpopup }
