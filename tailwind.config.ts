import type { Config } from "tailwindcss";

// カラー比率 base:accent:deep = 7:1:3 を維持すること。
// base  = メイン背景・ベースカラー（くすみブルーグレー）
// accent= 境界線・補助色（ミディアムグレー）
// deep  = テキスト・強調・UIパーツ（ディープネイビー）
// cream = 白の代替（純白は使用しない、温かみのあるオフホワイト）
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: "#bdc6ca",
          light: "#cdd4d7",
          dark: "#a9b3b8",
        },
        accent: {
          DEFAULT: "#889291",
          light: "#9ea7a6",
          dark: "#727d7c",
        },
        deep: {
          DEFAULT: "#32495f",
          light: "#425c76",
          dark: "#233342",
        },
        cream: {
          DEFAULT: "#fbf9f5",
          dark: "#faf8f5",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Hiragino Sans", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(50, 73, 95, 0.25)",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
