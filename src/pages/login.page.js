const APP_ID = 'com.saucelabs.mydemoapp.android';

// Two named waits instead of magic numbers. SHORT is for UI that is already on
// screen; LONG is for screen transitions.
const SHORT_WAIT = 5000;
const LONG_WAIT = 15000;

class LoginPage {
  // Elements are exposed as getters so each access resolves a fresh element.
  // WebdriverIO's matchers take the element itself and poll it, which keeps the
  // waiting visible in the assertion instead of hidden inside a helper.
  get menuButton() {
    return $('~View menu');
  }

  // The drawer's RecyclerView is absent from the hierarchy while the drawer is
  // closed, which makes it a reliable "the drawer is open" signal.
  get menuList() {
    return $('~Recycler view for menu');
  }

  get loginMenuItem() {
    return $('~Login Menu Item');
  }

  get logoutMenuItem() {
    return $('~Logout Menu Item');
  }

  get logoutConfirmationButton() {
    return $('android=new UiSelector().resourceId("android:id/button1")');
  }

  get usernameInput() {
    return $(`id=${APP_ID}:id/nameET`);
  }

  get passwordInput() {
    return $(`id=${APP_ID}:id/passwordET`);
  }

  get loginButton() {
    return $('~Tap to login with given credentials');
  }

  get errorMessage() {
    return $(`id=${APP_ID}:id/passwordErrorTV`);
  }

  async open() {
    await driver.execute('mobile: activateApp', { appId: APP_ID });
    await this.goToLogin();
  }

  // Tapping the hamburger a second time does not toggle the drawer shut, so
  // opening it twice would leave it open rather than closing it.
  async openMenu() {
    if (await this.menuList.isDisplayed()) {
      return;
    }
    await this.menuButton.waitForDisplayed({ timeout: LONG_WAIT });
    await this.menuButton.click();
    await this.menuList.waitForDisplayed({ timeout: SHORT_WAIT });
  }

  // The drawer holds exactly one of the Log In / Log Out rows, so waiting until
  // either one is present gives a definite answer instead of trusting a single
  // probe taken while the drawer is still drawing itself.
  async waitForMenuToSettle() {
    await browser.waitUntil(
      async () =>
        (await this.loginMenuItem.isDisplayed()) || (await this.logoutMenuItem.isDisplayed()),
      {
        timeout: SHORT_WAIT,
        timeoutMsg: 'The drawer opened but showed neither a Log In nor a Log Out row.',
      }
    );
  }

  // Opens the drawer if needed and enters the Login screen. Entering Login is
  // also how the drawer gets closed: pressing back exits the app instead of
  // just dismissing the drawer.
  async goToLogin() {
    await this.openMenu();
    await this.loginMenuItem.waitForDisplayed({ timeout: SHORT_WAIT });
    await this.loginMenuItem.click();
    await this.usernameInput.waitForDisplayed({ timeout: LONG_WAIT });
  }

  async login(username, password) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }

  // Presence of the Log Out row is the app's own signal that a session exists.
  // Leaves the drawer open so the caller can act on it without reopening.
  async isLoggedIn() {
    await this.openMenu();
    await this.waitForMenuToSettle();
    return this.logoutMenuItem.isDisplayed();
  }

  async logout() {
    await this.openMenu();
    await this.logoutMenuItem.waitForDisplayed({ timeout: SHORT_WAIT });
    await this.logoutMenuItem.click();
    await this.logoutConfirmationButton.waitForDisplayed({ timeout: SHORT_WAIT });
    await this.logoutConfirmationButton.click();
    // Logging out returns to the login screen; waiting for it means the next
    // test starts from a known screen instead of racing the transition.
    await this.loginButton.waitForDisplayed({ timeout: LONG_WAIT });
  }
}

module.exports = new LoginPage();
