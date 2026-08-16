# My Demo Appium

Appium + WebdriverIO tests for Sauce Labs' "My Demo App" on Android.

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
- `src/pages/catalog.page.js` - page object for the catalog screen
- `tests/specs/catalog.spec.js` - tests for the catalog landing view
- `apps/` - app binaries (not committed)

## Status

This is a working starting point (config, one page object, two smoke checks), not the finished suite. Locators were verified against the real app with `uiautomator dump`, not guessed. See `TEST_CASES.md` for the full test design.
