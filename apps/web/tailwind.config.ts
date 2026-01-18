import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          900: '#0b0f1a',
          800: '#141a2a',
          700: '#1f2a3d'
        },
        sand: {
          50: '#f7f4ef',
          100: '#efe7dd'
        },
        accent: {
          500: '#f37b3c',
          600: '#e7682f'
        }
      },
      boxShadow: {
        card: '0 24px 60px -40px rgba(11, 15, 26, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
