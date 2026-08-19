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

## Test coverage

| Spec | Cases |
| --- | --- |
| `tests/specs/login.spec.js` | Valid login reaches the catalog; locked-out user is rejected with the expected error |
| `tests/specs/catalog.spec.js` | Catalog landing screen renders; cart action is present in the header |

See `TEST_CASES.md` for the full test design, including the cases that are
designed but not yet automated.

## Verified behavior

Every selector in the suite is confirmed against the running app by capturing
the page source in each relevant state, rather than guessed. That includes the
drawer's `~Login Menu Item` / `~Logout Menu Item` accessibility IDs and the
`passwordErrorTV` error field used by the locked-out test.

## Test isolation

Each spec file runs in its own Appium session with `fullReset`, so specs cannot
leak state into one another.

Within a spec file the two login tests share a session, so `login.spec.js` hands
state back explicitly in `afterEach`. It checks whether a session is actually
active before logging out, because the locked-out test never authenticates and
an unconditional logout would wait out a timeout for a menu entry that can
never appear.

## Assertions

Assertions use WebdriverIO's own `expect`, which polls an element for up to
`waitforTimeout` before failing. That keeps the waiting visible in the test
rather than hidden inside a page-object helper:

```js
await expect(CatalogPage.catalogTitle).toBeDisplayed();
```

## Stability

The suite is run repeatedly rather than once. Most recent measurement: 8
consecutive runs (32 test executions), 3 of them with the host CPU saturated to
simulate a slower machine — 0 failures. Full suite runtime is roughly 40s.

A failing test writes a screenshot of the screen it failed on to `screenshots/`
(gitignored), so a failure can be diagnosed without reproducing it.

This is intentionally scoped as a focused, readable automation suite suitable for a portfolio demo and live coding walkthrough.
