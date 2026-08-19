# Test Design & Strategy — My Demo App (Android)

**Automation Tool:** Appium + WebdriverIO + JavaScript
**Target Application:** Sauce Labs "My Demo App" (Android) — [https://github.com/saucelabs/my-demo-app-android](https://github.com/saucelabs/my-demo-app-android)
**Platform:** Android emulator — Pixel 6A AVD, Android 16 (API 36)

---

## Why this tool + app

I chose **Appium with WebdriverIO and JavaScript** because it provides a mature and maintainable approach to Android UI automation while allowing me to work with a technology stack I am already highly comfortable with. WebdriverIO provides strong Appium integration, reusable screen objects, reliable element interaction, and a clean test structure while keeping the implementation lightweight for this assessment.

I chose **Sauce Labs My Demo App** because it provides realistic e-commerce functionality such as authentication, product browsing, sorting, cart management, and checkout. This provides enough business-critical functionality to demonstrate both positive and negative testing without creating artificial scenarios.

---

# 1. Test Case Descriptions

The test cases are prioritized based on business risk, user impact, and dependencies between features.

| ID    | Feature         | Priority | Type            | Description                                                                  |
| ----- | --------------- | -------- | --------------- | ---------------------------------------------------------------------------- |
| TC-01 | Login           | High     | Positive        | Standard user logs in successfully with valid credentials                    |
| TC-02 | Login           | High     | Negative        | Locked-out user is denied login with a clear error message                   |
| TC-03 | Product Catalog | High     | Positive        | User can view the product catalog and product information                    |
| TC-04 | Product Sorting | Medium   | Positive        | User can sort products and verify the displayed order                        |
| TC-05 | Shopping Cart   | High     | Positive        | User can add a product to the cart and verify the correct item and quantity  |
| TC-06 | Shopping Cart   | High     | Negative / Edge | User can remove an item and the cart correctly displays the empty state      |
| TC-07 | Checkout        | High     | Positive        | User can enter valid checkout information and proceed through checkout       |
| TC-08 | Checkout        | High     | Negative        | Checkout prevents progression when required information is missing           |
| TC-09 | Cart Quantity   | Medium   | Edge            | Cart quantity and item totals remain consistent when modifying cart contents |
| TC-10 | Product Details | Medium   | Positive        | User can open a product and verify its details before adding it to the cart  |

### Automation Scope

For the live automation portion, I will prioritize:

1. **TC-01 — Successful Login**
2. **TC-02 — Locked-Out User**
3. **TC-05 — Add Product to Cart**

These provide a good balance of positive and negative testing while demonstrating:

* Authentication
* Navigation
* Element interaction
* Locator strategy
* Assertions
* Error-state validation
* Reusable screen objects
* End-to-end business flow

If time permits, I will extend the automation to the checkout flow.

---

# 2. Test Strategy

## Design Pattern

I will use the **Page Object Model / Screen Object Model** using JavaScript.

Application-specific locators and interactions will be encapsulated within screen objects, while the test cases will focus on business behavior and expected outcomes.

This approach:

* Keeps test cases readable
* Reduces duplicated code
* Separates test logic from UI implementation
* Makes locator changes easier to maintain
* Allows common interactions to be reused across multiple tests

Example structure:

```text
my-demo-appium/
├── src/
│   └── pages/
│       ├── login.page.js
│       └── catalog.page.js
├── tests/
│   └── specs/
│       ├── login.spec.js
│       └── catalog.spec.js
├── config/
│   ├── shared.js
│   └── android.emulator.conf.js
├── test-data/
│   └── users.js
├── package.json
└── README.md
```

## Test Layer

The primary focus will be **end-to-end UI testing through Appium**.

The tests will validate functionality from the perspective of a real user, including:

* Screen navigation
* Input fields
* Buttons
* Product information
* Cart contents
* Error messages
* Checkout progression

I will primarily validate application state through visible business outcomes rather than directly manipulating internal application state.

For example, after adding a product to the cart, I will verify that the expected product and quantity are displayed in the cart rather than relying on internal application variables.

## Environment

I will use an **Android emulator with a Pixel device profile**. The suite is developed and verified against a Pixel 6A AVD running Android 16 (API 36), driven by Appium 3 with the UiAutomator2 driver.

An emulator is appropriate for this assessment because it:

* Provides a reproducible environment
* Does not depend on physical device availability
* Can be configured consistently
* Is easy for another engineer to reproduce
* Is sufficient for demonstrating functional Android UI automation within the limited assessment timeframe

For a production automation strategy, I would expand coverage to real devices and potentially a cloud device grid to validate device and OS compatibility.

However, that would be outside the scope of this focused assessment.

## Locator Strategy

I will prioritize locators in the following order:

1. **Accessibility ID / accessibility attributes**
2. **Android resource ID**
3. Other stable attributes
4. XPath only when a stable alternative is unavailable

The goal is to use selectors that are stable, readable, and less dependent on the application's UI hierarchy.

For example, I would prefer:

```javascript
$('~Login')
```

or a stable resource identifier over a deeply nested XPath such as:

```javascript
$('//android.widget.LinearLayout/android.widget.Button')
```

Accessibility-based locators are preferred where available because they are generally more maintainable and less sensitive to changes in the visual UI structure.

Every locator used in the suite was confirmed against the running app by
capturing the page source in each relevant state (logged out, logged in, and
the locked-out error state) rather than being inferred from the UI. Two results
worth recording:

* The navigation drawer exposes `~Login Menu Item` and `~Logout Menu Item` as
  accessibility IDs, so no text matching is needed to detect session state.
* The drawer's `RecyclerView` (`~Recycler view for menu`) is absent from the
  hierarchy while the drawer is closed, which makes it a reliable signal that
  the drawer is open and settled.

## Assertion Strategy

Assertions will focus on **business outcomes**, rather than simply checking whether an element exists.

### Successful Login

Verify that:

* Login succeeds
* The user is navigated away from the Login screen
* The Products screen is displayed
* Product content is visible

### Failed Login

Verify that:

* Authentication is rejected
* The expected error message is displayed
* The user remains on the Login screen
* The Products screen is not displayed

### Add to Cart

Verify that:

* The selected product is successfully added
* The cart reflects the expected quantity
* The correct product is displayed in the cart

This approach ensures that the tests are validating actual application behavior rather than simply confirming that UI elements are present.

## Scope Control

Given the 2–4 hour assessment window, I will intentionally avoid attempting to automate every available feature.

The following are outside the initial automation scope:

* Full regression coverage of every product
* Extensive device and OS compatibility testing
* Performance testing
* Network interruption testing
* Installation/uninstallation testing
* Full accessibility compliance testing
* Deep API/backend validation
* Exhaustive checkout data combinations
* Large-scale data-driven testing

These would be appropriate considerations for a production automation strategy, but including them in this assessment would increase complexity without providing significant additional evidence of the core automation approach.

---

# 3. Rationale

The test cases are prioritized based on **business risk, user impact, and feature dependencies**.

**Login is prioritized first** because authentication is the entry point to the application's primary functionality. If login is broken, subsequent product and checkout flows cannot be reliably exercised.

The **locked-out user scenario** is intentionally included because negative authentication scenarios are important and can easily be missed when automation focuses only on happy paths. The test validates both the error message and the fact that the user is prevented from progressing.

The **product catalog and add-to-cart flows** are next because they represent core e-commerce functionality. A user must be able to discover a product and successfully add it to their cart before checkout can provide any business value.

**Checkout is also high priority** because it represents a critical business flow. However, within the limited assessment timeframe, I would first establish stable coverage of authentication and cart functionality before extending into checkout.

The overall priority follows the main user journey:

```text
Authenticate
     ↓
Browse Products
     ↓
Select Product
     ↓
Add to Cart
     ↓
Checkout
```

This also creates a logical progression for the automation suite and makes failures easier to isolate.

---

# Detailed Test Cases

## TC-01: Successful Login with Valid Credentials

**Priority:** High
**Type:** Positive

### Preconditions

* Application is installed and launched.
* User is logged out (app opens directly to the Products/Catalog screen, not a Login screen).
* Valid standard-user credentials are available.

### Test Data

```text
Username: bod@example.com
Password: 10203040
```

### Steps

1. Launch the application.
2. Open the navigation menu and tap "Log In".
3. Verify that the Login screen is displayed.
4. Locate the username field.
5. Enter `bod@example.com`.
6. Locate the password field.
7. Enter `10203040`.
8. Tap the Login button.
9. Wait for navigation to complete.
10. Verify that the Products screen is displayed.
11. Verify that the product catalog is visible.

### Expected Result

The user is successfully authenticated and redirected to the Products screen. The product catalog is displayed.

---

## TC-02: Login Denied for Locked-Out User

**Priority:** High
**Type:** Negative

### Preconditions

* Application is installed and launched.
* User is logged out. This must be enforced explicitly: `fullReset` gives each spec file a clean install, but the two login cases share a single Appium session, so state carries over from one test to the next. If TC-01 ran immediately before this case, the navigation drawer will show "Log Out" instead of "Log In" unless the previous session is ended in teardown.
* Locked-out user credentials are available.

### Test Data

```text
Username: alice@example.com
Password: 10203040
```

### Steps

1. Launch the application.
2. Open the navigation menu. If it shows "Log Out", tap it to end the previous session, then reopen the menu.
3. Tap "Log In".
4. Verify that the Login screen is displayed.
5. Locate the username field.
6. Enter `alice@example.com`.
7. Locate the password field.
8. Enter `10203040`.
9. Tap the Login button.
10. Wait for the login response.
11. Verify that the login error message is displayed.
12. Verify that the user remains on the Login screen.
13. Verify that the Products screen has not been displayed.

### Expected Result

Authentication is rejected for the locked-out user. An appropriate error message is displayed and the user remains on the Login screen.

---

## TC-05: Add Product to Cart

**Priority:** High
**Type:** Positive

### Preconditions

* Application is installed.
* User is logged in as `bod@example.com`.
* Products screen is displayed.

### Steps

1. Verify that the Products screen is displayed.
2. Select an available product.
3. Verify that the product details are displayed.
4. Tap the Add to Cart button.
5. Navigate to the shopping cart.
6. Verify that the selected product is displayed.
7. Verify that the cart contains the expected quantity.
8. Verify that the product information displayed in the cart corresponds to the selected product.

### Expected Result

The selected product is successfully added to the shopping cart with the correct product and quantity.

---

# Implementation Status

Where the plan above currently stands in code. Automated cases are the ones
with a spec file behind them; the rest remain designed but not implemented.

| ID    | Case                       | Status        | Location                     |
| ----- | -------------------------- | ------------- | ---------------------------- |
| TC-01 | Successful login           | Automated     | `tests/specs/login.spec.js`   |
| TC-02 | Locked-out user denied     | Automated     | `tests/specs/login.spec.js`   |
| TC-03 | View product catalog       | Automated     | `tests/specs/catalog.spec.js` |
| TC-04 | Product sorting            | Designed only | —                            |
| TC-05 | Add product to cart        | Designed only | —                            |
| TC-06 | Remove item / empty cart   | Designed only | —                            |
| TC-07 | Checkout — valid info      | Designed only | —                            |
| TC-08 | Checkout — missing info    | Designed only | —                            |
| TC-09 | Cart quantity consistency  | Designed only | —                            |
| TC-10 | Product details            | Designed only | —                            |

## Known gaps between this design and the current code

These are tracked deliberately rather than quietly dropped:

* **TC-05 is named in the automation scope above but is not yet implemented.**
  It is the next case to build, and the one intended for the live-coding video.
* The **Successful Login** assertions in this document list four checks. The
  current test covers "Products screen is displayed" and "product content is
  visible"; "navigated away from the Login screen" is not asserted directly.
* The **Failed Login** assertions are covered: the test asserts the expected
  error message, that the login button is still displayed (the user is held on
  the Login screen), and that the Products screen is not shown.

## Stability and runtime

The suite is run repeatedly rather than once, on the assumption that a test
that passes once has not yet been shown to be reliable.

Most recent measurement — 8 consecutive runs (32 test executions), including
3 runs with the host CPU saturated to simulate a slower machine: **0 failures**.

Current runtime is roughly 40s wall for the full suite, split across two
Appium sessions (one per spec file, each with `fullReset`).

Assertions use WebdriverIO's `expect`, which polls the element rather than
probing it once, so a slow screen transition is absorbed instead of being
reported as a defect. The trade-off is that a genuine failure takes up to
`waitforTimeout` (15s) to report.

# Recording Day Checklist

* [ ] Project scaffold is created and tested before recording
* [ ] Appium/WebdriverIO configuration is working before recording
* [ ] Android emulator is configured and pre-booted
* [ ] Application is installed and ready
* [ ] This document is open on a second screen/window as a reference
* [ ] Test data is prepared
* [ ] Say out loud at the start what is pre-built versus what will be implemented live
* [ ] Explain locator choices while writing the automation
* [ ] Explain why assertions validate business outcomes
* [ ] Demonstrate at least one positive test
* [ ] Demonstrate at least one negative test
* [ ] Include one deliberate assertion failure to demonstrate that the test can detect an unexpected result
* [ ] Restore the correct assertion and run the final passing test
* [ ] Trim dead air such as compilation, emulator startup, and setup delays
* [ ] Verify the Loom/video link before submitting
* [ ] Verify the repository is accessible before submitting
* [ ] Test both links using an incognito/private browser window

---

# Live Demonstration Flow

The recommended recording flow is:

### 1. Introduction

Briefly explain:

* The application being tested
* Appium + WebdriverIO + JavaScript
* Android emulator
* Screen Object Model
* The test cases being demonstrated

### 2. Project Structure

Show the project structure and briefly explain the separation between:

* Screen objects
* Test specifications
* Configuration
* Test data

### 3. TC-01 — Successful Login

Demonstrate:

* Locators
* Input handling
* Login action
* Navigation
* Business-level assertions

### 4. TC-02 — Locked-Out User

Demonstrate:

* Negative testing
* Error-state validation
* Staying on the Login screen
* Preventing navigation to the Products screen

### 5. TC-05 — Add Product to Cart

Demonstrate:

* Product selection
* Reusable screen methods
* Cart navigation
* Product and quantity assertions

### 6. Deliberate Assertion Failure

Temporarily modify an expected value so that the test fails.

Explain:

> "I'm intentionally changing this expected value so we can demonstrate that the automation detects an unexpected result. This is to demonstrate the effectiveness of the assertion, rather than an actual application failure."

Then restore the correct expected value and run the test again.

### 7. Final Run

Run the completed tests and show the final passing result/report.

---

## Assessment Principle

The goal of this assessment is not to demonstrate the largest possible automation framework.

The goal is to demonstrate that I can:

* Identify high-risk scenarios
* Design meaningful positive and negative tests
* Choose appropriate automation tools
* Build maintainable mobile automation
* Select stable locators
* Write meaningful assertions
* Structure automation for maintainability
* Control scope based on time and risk
* Explain the reasoning behind automation decisions

A smaller, reliable test suite with clear design decisions is preferable to a large suite of fragile tests.
