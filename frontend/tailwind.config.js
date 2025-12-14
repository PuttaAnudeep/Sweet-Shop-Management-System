/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                chocolate: {
                    50: '#fdf8f6',
                    100: '#f2e8e5',
                    200: '#eaddd7',
                    300: '#e0cec7',
                    400: '#d2bab0',
                    500: '#a1887f',
                    600: '#8d6e63',
                    700: '#795548', // Primary
                    800: '#5d4037',
                    900: '#3e2723', // Dark
                },
                gold: {
                    400: '#D4AF37', // Accent
                    500: '#C5A028',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
            }
        },
    },
    plugins: [],
}
