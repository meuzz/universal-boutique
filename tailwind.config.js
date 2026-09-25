/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#262E3A",
          light: "#3A4656",
          dark: "#1A212B",
        },
        accent: {
          DEFAULT: "#1976D2",
          dark: "#1565C0",
          light: "#90CAF9",
        },
        soleil: {
          DEFAULT: "#F6B92E",
          dark: "#C98A0B",
        },
        success: "#4E9A2A",
      },
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
