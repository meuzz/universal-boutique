/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1A1A1A",
          light: "#3D3D3D",
          dark: "#0D0D0D",
        },
        accent: {
          DEFAULT: "#EA580C",
          dark: "#C2410C",
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
