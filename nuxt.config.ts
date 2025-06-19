import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },

  app: {
    // pageTransition: { name: "page", mode: "out-in" },
  },

  alias: {
    "~/*": "./*",
    "@/*": "./*",
  },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@pinia/nuxt",
    "@nuxtjs/color-mode",
    "nuxt-csurf",
  ],

  css: ["~/assets/css/main.css"],

  colorMode: {
    dataValue: "theme",
  },

  eslint: {
    config: {
      standalone: false,
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],

  },

});
