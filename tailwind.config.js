/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E3A8A",
          light: "#2E4FAE",
          dark: "#152B66",
        },
        accent: {
          DEFAULT: "#F97316",
          dark: "#C2570B",
          light: "#FDBA74",
        },
        success: "#16A34A",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
