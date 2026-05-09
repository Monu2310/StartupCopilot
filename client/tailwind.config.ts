import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050507",
        slate: "#141419",
        mint: "#ef233c",
        ember: "#b3122d",
        sky: "#f25f6f",
        haze: "#24242c",
        accent: "#ef233c",
        carbon: "#0f0b0f",
        graphite: "#191218",
        smoke: "#c9c4c8"
      },
      boxShadow: {
        glow: "0 0 30px rgba(239, 35, 60, 0.18)"
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at top left, rgba(239, 35, 60, 0.15), transparent 45%), radial-gradient(circle at 80% 20%, rgba(239, 35, 60, 0.2), transparent 40%), radial-gradient(circle at 50% 80%, rgba(239, 35, 60, 0.12), transparent 45%)"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" }
        }
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        fadeUp: "fadeUp 0.6s ease-out both"
      }
    }
  },
  plugins: []
} satisfies Config;
