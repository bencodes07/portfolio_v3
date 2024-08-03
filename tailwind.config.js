/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,ts,jsx,tsx}", "./src/App.tsx"],
  theme: {
    extend: {
      backgroundImage: () => ({
        "landing-bg-image": "var(--landing-bg-image)",
      }),
      colors: {
        dark: "var(--dark)",
        light: "var(--light)",

        "gray-4": "var(--gray-4)",
        "gray-3": "var(--gray-3)",
        "gray-2": "var(--gray-2)",
        "gray-1": "var(--gray-1)",

        "svg-line": "var(--svg-line)",
      },
    },
  },
  plugins: [],
};
