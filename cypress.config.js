const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "76ietr",
  e2e: {
    baseUrl: "https://staging.lpitko.ru",
    watchForFileChanges: false,
    testIsolation: false,
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

