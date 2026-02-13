/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Cyberpunk Black & Red Theme
                cyber: {
                    black: '#000000',
                    darkgray: '#0a0a0a',
                    gray: '#1a1a1a',
                    medgray: '#2a2a2a',
                    lightgray: '#3a3a3a',
                    offwhite: '#e0e0e0',
                    white: '#FFFFFF',
                    red: {
                        50: '#FFE5E5',
                        100: '#FFCCCC',
                        200: '#FF9999',
                        300: '#FF6666',
                        400: '#FF3333',
                        500: '#FF0000',  // Primary red
                        600: '#E60000',
                        700: '#CC0000',
                        800: '#B30000',
                        900: '#990000',
                    },
                    neon: {
                        red: '#FF006E',
                        pink: '#FF1744',
                        crimson: '#DC143C',
                        blood: '#8B0000',
                    }
                },
            },
            fontFamily: {
                cyber: ['Rajdhani', 'Orbitron', 'sans-serif'],
                mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
                display: ['Audiowide', 'Electrolize', 'sans-serif'],
            },
            boxShadow: {
                'neon-red': '0 0 15px rgba(255, 0, 0, 0.5), 0 0 30px rgba(255, 0, 0, 0.3)',
                'neon-red-sm': '0 0 10px rgba(255, 0, 0, 0.3)',
                'neon-pink': '0 0 10px #FF006E, 0 0 20px #FF006E',
                'cyber': '4px 4px 0px #FF0000',
                'cyber-red': '4px 4px 0px #FF0000',
            },
            animation: {
                'glitch': 'glitch 1s infinite',
                'scanline': 'scanline 8s linear infinite',
                'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
                'slide-in': 'slide-in 0.3s ease-out',
            },
            keyframes: {
                glitch: {
                    '0%, 100%': { transform: 'translate(0)' },
                    '20%': { transform: 'translate(-2px, 2px)' },
                    '40%': { transform: 'translate(-2px, -2px)' },
                    '60%': { transform: 'translate(2px, 2px)' },
                    '80%': { transform: 'translate(2px, -2px)' },
                },
                scanline: {
                    '0%': { transform: 'translateY(-100%)' },
                    '100%': { transform: 'translateY(100%)' },
                },
                'neon-pulse': {
                    '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
                    '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
                },
                'slide-in': {
                    '0%': { transform: 'translateX(-100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
            },
            backgroundImage: {
                'cyber-grid': 'linear-gradient(rgba(255,0,0,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,0,0.05) 1px, transparent 1px)',
                'cyber-gradient': 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
            },
            backgroundSize: {
                'grid': '20px 20px',
            },
        },
    },
    plugins: [],
}
