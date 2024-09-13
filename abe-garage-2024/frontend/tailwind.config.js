/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Add paths to your source files here
    "./public/index.html", // If you have any HTML files, include their paths
  ],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
      colors: {
        darkorange: "#ff8c00",
        blue: "#08194A",
      },
      fontFamily: {
        serif: ["Times New Roman", "serif"],
      },
    },
  },
  plugins: [
    // Include any plugins you’re using
  ],
};
