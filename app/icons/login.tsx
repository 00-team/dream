export const PhoneIcon = P => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        stroke-width='0'
        viewBox='0 0 20 20'
        aria-hidden='true'
        height={P.size || 25}
        width={P.size || 25}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M8 16.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z'></path>
        <path
            fill-rule='evenodd'
            d='M4 4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V4Zm4-1.5v.75c0 .414.336.75.75.75h2.5a.75.75 0 0 0 .75-.75V2.5h1A1.5 1.5 0 0 1 14.5 4v12a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 16V4A1.5 1.5 0 0 1 7 2.5h1Z'
            clip-rule='evenodd'
        ></path>
    </svg>
)

export const GoBackIcon = P => (
    <svg
        stroke='currentColor'
        fill='currentColor'
        stroke-width='0'
        viewBox='0 0 512 512'
        height={P.size || 25}
        width={P.size || 25}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path
            fill='none'
            stroke-linecap='round'
            stroke-linejoin='round'
            stroke-width='48'
            d='M244 400 100 256l144-144M120 256h292'
        ></path>
    </svg>
)
