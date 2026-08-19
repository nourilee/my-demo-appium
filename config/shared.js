const fs = require('fs');
const path = require('path');
require('dotenv').config();

const screenshotDir = path.resolve(process.cwd(), 'screenshots');

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
      `The app file for ${platformKey} was not found at ${filePath}. Add the APK before running the emulator suite.`
    );
  }
};

const baseConfig = {
  runner: 'local',
  specs: [path.resolve(__dirname, '../tests/specs/**/*.js')],
  exclude: [],
  logLevel: process.env.WDIO_LOG_LEVEL || 'warn',
  bail: 0,
  // Element assertions poll for up to this long before failing, so a slow
  // screen transition is absorbed rather than reported as a bug.
  waitforTimeout: 15000,
  connectionRetryTimeout: 180000,
  connectionRetryCount: 3,
  framework: 'mocha',
  mochaOpts: {
    timeout: 60000,
  },
  reporters: [['spec', { addConsoleLogs: true }]],
  services: [],

  // A failed mobile test is far easier to diagnose with the screen it failed on
  // than by trying to reproduce it, so capture one automatically.
  afterTest: async function (test, context, { passed }) {
    if (passed) {
      return;
    }
    fs.mkdirSync(screenshotDir, { recursive: true });
    const fileName = `${test.parent} ${test.title}`.replace(/[^\w-]+/g, '_');
    await browser.saveScreenshot(path.join(screenshotDir, `${fileName}.png`));
  },
};

module.exports = {
  appPath,
  ensureAppExists,
  baseConfig,
};
