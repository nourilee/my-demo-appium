const { baseConfig, appPath, ensureAppExists } = require('./shared');

const androidAppPath = appPath(process.env.ANDROID_APP_PATH || './apps/MyDemoApp.apk');
ensureAppExists('android', androidAppPath);

exports.config = {
  ...baseConfig,
  port: 4723,
  maxInstances: 1,
  services: ['appium'],
  appium: {
    args: {
      address: '127.0.0.1',
      port: 4723,
      relaxedSecurity: true,
      log: './logs/appium-android.log',
      loglevel: 'warn',
    },
  },
  capabilities: [{
    platformName: 'Android',
    'appium:automationName': 'UiAutomator2',
    'appium:deviceName': process.env.ANDROID_DEVICE_NAME || 'emulator-5554',
    'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION || '16',
    'appium:app': androidAppPath,
    'appium:appPackage': 'com.saucelabs.mydemoapp.android',
    'appium:appActivity': 'com.saucelabs.mydemoapp.android.view.activities.SplashActivity',
    'appium:udid': process.env.ANDROID_UDID || undefined,
    'appium:autoGrantPermissions': true,
    'appium:noReset': false,
    'appium:fullReset': true,
    'appium:newCommandTimeout': 120,
  }],
};
