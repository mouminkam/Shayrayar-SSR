/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        // Theme Colors - الألوان الرئيسية
        theme: {
          DEFAULT: '#EB0029', // الأحمر - اللون الرئيسي
        },
        theme2: {
          DEFAULT: '#FC791A', // البرتقالي - اللون الثانوي
        },
        title: {
          DEFAULT: '#010F1C', // الداكن - للعناوين
        },
        text: {
          DEFAULT: '#5C6574', // النص - للنصوص العادية
        },
        bg2: {
          DEFAULT: '#F4F1EA', // الخلفية الفاتحة
        },
        bg3: {
          DEFAULT: '#181818', // الخلفية الداكنة
        },
      },
    },
  },
  plugins: [],
};

