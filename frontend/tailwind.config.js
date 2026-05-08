/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,jsx}",
    ],
    theme: {
        extend: {
            colors: {
                'dark-bg': '#0f172a',
                'dark-card': '#1e293b',
                'dark-border': '#334155',
                'primary': '#3b82f6',
                'success': '#10b981',
                'danger': '#ef4444',
            }
        },
    },
    plugins: [],
    darkMode: 'class',
}
