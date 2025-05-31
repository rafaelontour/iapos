module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(), // Usa o novo plugin
    require('autoprefixer'),
  ],
};