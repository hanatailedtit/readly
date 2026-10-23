import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        main: '#5ae9e4',
        'dark-main': '#47b6b2',
        black: '#111111',
        gray: '#d3d3d3',
        'light-gray': '#efefef',
        'dark-gray': '#898989',
        blue: '#5676d3',
        'light-blue': '#eff3ff',
        red: '#ff0000',
        'light-red': '#fbc9c9',
        'dark-red': '#be0000',
        green: '#00ff32',
        'light-green': '#aeffbe',
        yellow: '#FFFF00',
        'light-yellow': '#ffffc9',
        brown: '#964B00',
        'light-brown': '#edd6bf',
        highlight: '#fdf5e1',
      },
      fontSize: {
        sm: '12px',
        md: '14px',
        base: '16px',
        lg: '22px',
        xl: '32px',
      },
      animation: {
        'show-toast': 'show-toast 0.3s',
      },
      screens: {
        sm: '0',
        md: '640px',
        lg: '748px',
        xl: '1080px',
        '2xl': '1280px',
      },
    },
  },
  plugins: [],
};

export default config;
