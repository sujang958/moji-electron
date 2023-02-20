/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./screens/*.html"],
  theme: {
    extend: {
      fontFamily: {
        pretendard: [
          "toss-face",
          "Pretendard Variable",
          "-apple-system",
          "Inter",
          "Noto Sans KR",
          "sans-serif",
        ],
      },
    },
  },
  plugins: [],
}
