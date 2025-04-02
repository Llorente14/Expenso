module.exports = {
  content: [
    "./views/**/*.ejs", // Pastikan semua file EJS di folder views terbaca
    "./public/**/*.html", // Jika ada file HTML di public
    "./src/**/*.{js,ts,jsx,tsx}", // Jika ada file JS/TS yang menggunakan Tailwind
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
