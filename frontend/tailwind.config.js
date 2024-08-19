/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                darkBrown: "#481E14",
                lightBrown: "#F3EEEA",
            },
        },
    },
    plugins: [daisyui],
    daisyui: {
        themes: [],
    },
};
