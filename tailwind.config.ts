import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#05070d",
        midnight: "#08111f",
        obsidian: "#0b1220",
        emeraldx: "#20e29c",
        goldx: "#d7b56d"
      },
      boxShadow: {
        glow: "0 0 40px rgba(32, 226, 156, 0.16)",
        gold: "0 0 34px rgba(215, 181, 109, 0.16)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" }
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" }
        },
        pulseLine: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" }
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(420%)" }
        },
        candleRise: {
          "0%, 100%": { transform: "scaleY(0.72)", opacity: "0.72" },
          "50%": { transform: "scaleY(1)", opacity: "1" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        ticker: "ticker 32s linear infinite",
        pulseLine: "pulseLine 2.4s ease-in-out infinite",
        scan: "scan 5s linear infinite",
        candleRise: "candleRise 2.8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
