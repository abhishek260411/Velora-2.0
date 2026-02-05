/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                velora: {
                    light: "#F5F5F7",
                    dark: "#000000",
                }
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            }
        },
    },
    plugins: [],
};
