const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "gc758f",
  e2e: {
    baseUrl: "https://staging.lpitko.ru",
    watchForFileChanges: false,
    testIsolation: false,
    video: false,
    viewportWidth: 1366,
    viewportHeight: 768,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    environment: "staging",
    email: "shevtma@yandex.ru",
    password: "ZU9590",
  },
});

