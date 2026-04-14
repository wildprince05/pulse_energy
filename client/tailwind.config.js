/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pulse: {
          cyan: "#22d3ee",
          pink: "#fb7185",
          lime: "#a3e635"
        }
      }
    }
  },
  plugins: []
};

