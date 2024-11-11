import type { Config } from 'tailwindcss';

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: 'class',
  theme: {
    backgroundColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--bg-primary) / <alpha-value>)',
      secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
      skeleton: 'rgb(var(--bg-skeleton) / <alpha-value>)',
    }),
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--border-primary) / <alpha-value>)',
      secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
    }),
    textColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--text-primary) / <alpha-value>)',
      secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
    }),
    extend: {
      colors: {
        blue: {
          '50': 'rgb(var(--blue-50) / <alpha-value>)',
          '100': 'rgb(var(--blue-100) / <alpha-value>)',
          '200': 'rgb(var(--blue-200) / <alpha-value>)',
          '300': 'rgb(var(--blue-300) / <alpha-value>)',
          '400': 'rgb(var(--blue-400) / <alpha-value>)',
          '500': 'rgb(var(--blue-500) / <alpha-value>)',
          '600': 'rgb(var(--blue-600) / <alpha-value>)',
          '700': 'rgb(var(--blue-700) / <alpha-value>)',
          '800': 'rgb(var(--blue-800) / <alpha-value>)',
          '900': 'rgb(var(--blue-900) / <alpha-value>)',
          '950': 'rgb(var(--blue-950) / <alpha-value>)',
        },
        orange: {
          '50': 'rgb(var(--orange-50) / <alpha-value>)',
          '100': 'rgb(var(--orange-100) / <alpha-value>)',
          '200': 'rgb(var(--orange-200) / <alpha-value>)',
          '300': 'rgb(var(--orange-300) / <alpha-value>)',
          '400': 'rgb(var(--orange-400) / <alpha-value>)',
          '500': 'rgb(var(--orange-500) / <alpha-value>)',
          '600': 'rgb(var(--orange-600) / <alpha-value>)',
          '700': 'rgb(var(--orange-700) / <alpha-value>)',
          '800': 'rgb(var(--orange-800) / <alpha-value>)',
          '900': 'rgb(var(--orange-900) / <alpha-value>)',
          '950': 'rgb(var(--orange-950) / <alpha-value>)',
        },
        green: {
          '50': 'rgb(var(--green-50) / <alpha-value>)',
          '100': 'rgb(var(--green-100) / <alpha-value>)',
          '200': 'rgb(var(--green-200) / <alpha-value>)',
          '300': 'rgb(var(--green-300) / <alpha-value>)',
          '400': 'rgb(var(--green-400) / <alpha-value>)',
          '500': 'rgb(var(--green-500) / <alpha-value>)',
          '600': 'rgb(var(--green-600) / <alpha-value>)',
          '700': 'rgb(var(--green-700) / <alpha-value>)',
          '800': 'rgb(var(--green-800) / <alpha-value>)',
          '900': 'rgb(var(--green-900) / <alpha-value>)',
          '950': 'rgb(var(--green-950) / <alpha-value>)',
        },
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
    },
  },
  plugins: [],
} as Config;

