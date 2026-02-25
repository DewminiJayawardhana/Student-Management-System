/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#C72C41",    // Crimson Red
        secondary: "#A60054",  // Maroon
        lightBg: "#F5F5F5",    // Light Grey
        cardBg: "#FFFFFF",     // White
        sidebarText: "#D1D1D1"
      },
    },
  },
  plugins: [],
}