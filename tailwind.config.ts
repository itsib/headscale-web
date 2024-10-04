import type { Config } from 'tailwindcss';

export default {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  darkMode: ['variant', [
    '@media (prefers-color-scheme: dark) { &:not(.light *) }',
    '&:is(.dark *)',
  ]],
  theme: {
    backgroundColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--bg-primary) / <alpha-value>)',
      secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
    }),
    borderColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--border-primary) / <alpha-value>)',
    }),
    textColor: ({ theme }) => ({
      ...theme('colors'),
      accent: 'rgb(var(--accent) / <alpha-value>)',
      primary: 'rgb(var(--text-primary) / <alpha-value>)',
      secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
    }),
    extend: {
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

