export default {
    darkMode: "class",
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "rgb(var(--color-primary) / <alpha-value>)",
                muted: "rgb(var(--color-muted) / <alpha-value>)",
                hoverBg: "rgb(var(--color-hover-bg) / <alpha-value>)",
                activeText: "rgb(var(--color-active-text) / <alpha-value>)",
                buttonBg: "rgb(var(--color-button-bg) / <alpha-value>)",
            },
            fontFamily: {
                inter: "var(--inter-font-family)",
            },
        },
    },
    plugins: [],
};
