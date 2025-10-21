import { withTV } from 'tailwind-variants'

/** @type {import('tailwindcss').Config} */
export default withTV({
    darkMode: ["class"],
    content: [
        './index.html',
        './src/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                'opac-white': 'white'
            },
            textShadow: {
                'sm': '1px 1px 1px var(--tw-shadow-color)',
                'md': '2px 2px 4px var(--tw-shadow-color)',
                'lg': '4px 4px 8px var(--tw-shadow-color)',
                'none': 'none',
            },
            listStyleType: {
                square: 'square',
                roman: 'upper-roman',
            }
        }
    },
    safelist: [
        'opac-white',
    ],
})
