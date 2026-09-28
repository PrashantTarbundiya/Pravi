/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1200px", // Claude max-width ~1200px
      },
    },
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'Tiempos Headline', 'Garamond', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        canvas: "#faf9f5",
        "surface-soft": "#f5f0e8",
        "surface-card": "#efe9de",
        "surface-cream-strong": "#e8e0d2",
        "surface-dark": "#181715",
        "surface-dark-elevated": "#252320",
        "surface-dark-soft": "#1f1e1b",
        coral: {
          DEFAULT: "#cc785c",
          active: "#a9583e",
          disabled: "#e6dfd8",
        },
        ink: "#141413",
        "body-strong": "#252523",
        body: "#3d3d3a",
        muted: {
          DEFAULT: "#6c6a64",
          soft: "#8e8b82",
        },
        hairline: {
          DEFAULT: "#e6dfd8",
          soft: "#ebe6df",
        },
        "accent-teal": "#5db8a6",
        "accent-amber": "#e8a55a",
        border: "#e6dfd8",
        input: "#e6dfd8",
        ring: "#cc785c",
        background: "#faf9f5",
        foreground: "#141413",
        primary: {
          DEFAULT: "#cc785c",
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#efe9de",
          foreground: "#141413",
        },
        destructive: {
          DEFAULT: "#c64545",
          foreground: "#ffffff",
        },
        card: {
          DEFAULT: "#efe9de",
          foreground: "#141413",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",   // Standard button / input
        lg: "12px",  // Content cards
        xl: "16px",  // Hero container
        pill: "9999px",
      },
      spacing: {
        section: "96px", // Claude standard rhythm
      }
    },
  },
  plugins: [],
}
