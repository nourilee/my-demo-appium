# My Demo Appium

Android Appium + WebdriverIO automation for Sauce Labs' My Demo App, built as a lightweight mobile UI portfolio project.

## Recording

Demo video / live-coding recording:
https://drive.google.com/drive/folders/1WonNXG0UPYQRi6J1YA9m7gbyAGwB_7D1?usp=sharing

## What this project includes

- Android emulator configuration
- Appium + WebdriverIO setup
- Page object structure
- Verified smoke tests against the live app UI
- A simple portfolio-friendly repo layout

## Local setup

1. Install dependencies:
   `npm install`
2. Download the APK from the [My Demo App Android releases](https://github.com/saucelabs/my-demo-app-android/releases) and place it at `apps/MyDemoApp.apk`
3. Update the environment file if needed:
   `cp .env.example .env`
4. Install the Android driver:
   `npx appium driver install uiautomator2`
5. Start an Android emulator and confirm it is visible in ADB
6. Run the suite:
   `npm test`

## Project structure

- `config/shared.js` - common WDIO settings
- `config/android.emulator.conf.js` - Android capabilities and app launch settings
- `src/pages/catalog.page.js` - catalog screen page object
- `src/pages/login.page.js` - login page object
- `tests/specs/catalog.spec.js` - smoke tests for the catalog landing view
- `tests/specs/login.spec.js` - login test flow
- `test-data/users.js` - sample credentials
- `apps/` - app binaries (not committed)

## Verified behavior

The project currently validates core app startup and catalog visibility against the actual emulator UI, using selectors confirmed from `uiautomator dump` rather than guessed values.

This is intentionally scoped as a focused, readable automation suite suitable for a portfolio demo and live coding walkthrough.
