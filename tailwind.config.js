const { nextui } = require('@nextui-org/theme/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  darkMode: 'class',
  plugins: [
    nextui({
      themes: {
        light: {
          pc: {
            default: '#7766c6',
            50: '#f1f3fc',
            100: '#e6e8f9',
            200: '#d2d4f3',
            300: '#b6b9eb',
            400: '#9a98e1',
            500: '#877fd5',
            600: '#7766c6',
            700: '#6655ad',
            800: '#53478c',
            900: '#463e71',
            950: '#2a2442',
          },
          sc: {
            default: '#ffc212',
            50: '#fffbeb',
            100: '#fff5c6',
            200: '#ffea88',
            300: '#ffd94a',
            400: '#ffc212',
            500: '#f9a407',
            600: '#dd7c02',
            700: '#b75706',
            800: '#94420c',
            900: '#7a360d',
            950: '#461b02',
          },
        },
        dark: {},
      },
    }),
  ]
}
