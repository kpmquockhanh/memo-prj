/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './*.{html,js}',
    "./src/**/*.blade.php",
    "./src/**/*.js",
    "./src/**/*.vue",
  ],
  theme: {
    extend: {},
  },
  // eslint-disable-next-line no-undef
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light"],
  },
}

