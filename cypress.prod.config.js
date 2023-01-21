const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: "76ietr",
  e2e: {
    baseUrl: "https://santa-secret.ru/",
    watchForFileChanges: false,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    environment: "production",
    email: "shevtma@gmail.com",
    password: "RP7105",
  },
});

