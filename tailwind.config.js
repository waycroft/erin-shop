/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      title: ["Timonium", "sans-serif"],
      body: ["Inter", "sans-serif"],
    },
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        eh: {
          primary: "#84cc16",
          secondary: "#4d7c0f",
          accent: "#abaff2",
          neutral: "#1B1B22",
          "base-100": "#f3f4f6",
          info: "#58B6D5",
          success: "#43D07E",
          warning: "#E6BA0A",
          error: "#FB1341",
        },
      },
    ],
    darkTheme: false,
  },
};
