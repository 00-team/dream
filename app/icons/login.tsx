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

export const DashboardIcon = P => (
    <div class='icon h2'>
        <svg
            stroke='currentColor'
            fill='currentColor'
            stroke-width='0'
            viewBox='0 0 24 24'
            height={P.size || 25}
            width={P.size || 25}
            xmlns='http://www.w3.org/2000/svg'
        >
            <path fill='none' d='M0 0h24v24H0z'></path>
            <path d='M11 21H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h6v18zm2 0h6c1.1 0 2-.9 2-2v-7h-8v9zm8-11V5c0-1.1-.9-2-2-2h-6v7h8z'></path>
        </svg>
    </div>
)

export const LoginIcon = P => (
    <svg
        stroke='currentColor'
        fill='none'
        stroke-width='2'
        viewBox='0 0 24 24'
        stroke-linecap='round'
        stroke-linejoin='round'
        height={P.size || 25}
        width={P.size || 25}
        xmlns='http://www.w3.org/2000/svg'
    >
        <path d='M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4'></path>
        <polyline points='10 17 15 12 10 7'></polyline>
        <line x1='15' y1='12' x2='3' y2='12'></line>
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
