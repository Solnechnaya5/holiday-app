// nuxt.config.ts

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      baseURL: process.env.API_BASE_URL
    },
  },
  css: [
    '~/assets/styles.css',
  ],
  modules: ['@nuxt/fonts'],
  fonts: {
    families: [
      { name: 'Roboto', provider: 'google' },
    ]
  }
});
