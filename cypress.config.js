const { defineConfig } = require("cypress");
const { beforeRunHook, afterRunHook } = require('cypress-mochawesome-reporter/lib');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  exit:true,
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Report Test Cypress',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    quite:true
  },
  e2e: {
    specPattern: 'cypress/integration/**/*.js',
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    chromeWebSecurity: false,
    //numTestsKeptInMemory: 0,
    baseUrl: 'http://localhost:4200',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    //videoCompression: true,
    screenshotOnRunFailure: true,
  },
  defaultCommandTimeout: 10000,
});
