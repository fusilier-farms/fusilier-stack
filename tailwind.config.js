module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        'fusilier-tan': '#F0EEDF',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
  ],
};
