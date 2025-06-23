import tailwindcss from "@tailwindcss/vite";

import "./lib/env";

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
    "@vee-validate/nuxt",
    "@peterbud/nuxt-query",
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

  nuxtQuery: {

    // autoImports: ["useQuery", "useMutation", "useQueryClient", "useInfiniteQuery"],

    devtools: true,

    queryClientOptions: {
      defaultOptions: {
        queries: {
          retry: 3,
          retryDelay: 500,
          staleTime: 5000, // 5 seconds : the data will be considered stale after 5 seconds
          gcTime: 1000 * 60 * 10, // 10 minute : the cache will be cleared after 10 minute of inactivity
          throwOnError: (_error, query) => {
            return typeof query.state.data === "undefined";
          },
          networkMode: "offlineFirst",
        },
      },
    },
  },

  vite: {
    plugins: [
      tailwindcss(),
    ],

  },

});
