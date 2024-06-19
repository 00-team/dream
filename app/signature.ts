let signature: HTMLAnchorElement = document.querySelector('.signature-00-team')

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#!%^&*()_-+=/'
const ORIGIN = signature.innerText

function hack_effect() {
    let counter = 0

    let interval = setInterval(() => {
        if (counter >= ORIGIN.length) clearInterval(interval)

        signature.innerText = signature.innerText
            .split('')
            .map((_, i) => {
                if (i < counter) return ORIGIN[i]

                return LETTERS[Math.floor(Math.random() * LETTERS.length)]
            })
            .join('')
    }, 30)

    let counter_interval = setInterval(() => {
        counter++
        if (counter >= ORIGIN.length) clearInterval(counter_interval)
    }, 100)
}

let signature_00_team_observer = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return
    hack_effect()
    signature_00_team_observer.disconnect()
})
signature_00_team_observer.observe(signature)
