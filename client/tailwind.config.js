const defaultTheme = require("tailwindcss/defaultTheme");
// const plugin = require("tailwindcss/plugin");

module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  important: "body",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  mode: "jit",
  darkMode: "class",
  variants: {
    lineClamp: ["responsive", "hover"],
  },
  // prefix: "tw-",
  // important: true,
};
