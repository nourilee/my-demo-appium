const fs = require('fs');
const path = require('path');
require('dotenv').config();

const appPath = (envValue) => {
  if (!envValue) return undefined;
  return path.resolve(process.cwd(), envValue);
};

const ensureAppExists = (platformKey, filePath) => {
  if (!filePath) {
    throw new Error(
      `No app path was provided for ${platformKey}. Set ${platformKey.toUpperCase()}_APP_PATH in your .env file or add the app under the apps folder.`
    );
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(
      `The app file for ${platformKey} was not found at ${filePath}. Add the APK or .app bundle before running the emulator suite.`
    );
  }
};

const baseConfig = {
  runner: 'local',
  specs: [path.resolve(__dirname, '../tests/specs/**/*.js')],
  exclude: [],
  logLevel: process.env.WDIO_LOG_LEVEL || 'warn',
  bail: 0,
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    timeout: 60000,
  },
  reporters: [['spec', { addConsoleLogs: true }]],
  services: [],
  before: async function () {
    const chai = await import('chai');
    global.expect = chai.expect;
  },
  afterTest: async function () {
    // Extension hook for test-level cleanup if needed.
  },
};

module.exports = {
  appPath,
  ensureAppExists,
  baseConfig,
};
