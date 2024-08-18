/** @type {import('tailwindcss').Config} */
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
    plugins: [],
};
