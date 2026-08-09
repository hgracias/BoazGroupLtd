import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", lg: "2rem" },
      screens: { "2xl": "1280px" },
    },
    extend: {
      colors: {
        // Brand navy, sampled from the Boaz Group Ltd logo.
        navy: {
          50: "#EEEFF8",
          100: "#DCDEF1",
          200: "#B7BBE3",
          300: "#8E94D0",
          400: "#616AB6",
          500: "#3D4599",
          600: "#2B348C",
          700: "#232A73",
          800: "#1B2058",
          900: "#14173F",
          950: "#0B0D26",
        },
        gold: {
          50: "#FBF6EA",
          100: "#F6ECD2",
          200: "#EDD9A3",
          300: "#E3C374",
          400: "#D8AC4E",
          500: "#C9962E",
          600: "#A97B22",
          700: "#835E1C",
          800: "#5C4214",
          900: "#3A2A0D",
        },
        sand: {
          50: "#FBFAF7",
          100: "#F5F2EB",
          200: "#EAE5DA",
          300: "#DAD3C4",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Portal surfaces — light values on the public site, dark inside
        // .portal-shell (see globals.css).
        field: "hsl(var(--field))",
        panel: "hsl(var(--panel))",
        elevated: "hsl(var(--elevated))",
        "card-hover": "hsl(var(--card-hover))",
        success: "hsl(var(--success))",
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 2px rgba(20, 23, 63, 0.04), 0 8px 24px -12px rgba(20, 23, 63, 0.18)",
        lift: "0 2px 4px rgba(20, 23, 63, 0.05), 0 20px 40px -20px rgba(20, 23, 63, 0.35)",
      },
      backgroundImage: {
        "navy-grid":
          "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "dash-flow": {
          from: { strokeDashoffset: "0" },
          to: { strokeDashoffset: "-24" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "dash-flow": "dash-flow 1.2s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
