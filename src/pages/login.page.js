const APP_ID = 'com.saucelabs.mydemoapp.android';

class LoginPage {
  constructor() {
    this.menuButton = '~View menu';
    this.loginMenuItem = '~Login Menu Item';
    this.logoutMenuItem = 'android=new UiSelector().textMatches(".*Log\\s*Out.*|.*Logout.*")';
    this.logoutConfirmationButton = 'android=new UiSelector().resourceId("android:id/button1")';
    this.usernameInput = `id=${APP_ID}:id/nameET`;
    this.passwordInput = `id=${APP_ID}:id/passwordET`;
    this.loginButton = '~Tap to login with given credentials';
    this.errorMessage = `id=${APP_ID}:id/passwordErrorTV`;
  }

  async open() {
    await driver.launchApp({ appId: APP_ID });
    await $(this.menuButton).waitForDisplayed({ timeout: 5000 });
    await $(this.menuButton).click();
    await $(this.loginMenuItem).waitForDisplayed({ timeout: 5000 });
    await $(this.loginMenuItem).click();
  }

  async login(username, password) {
    await $(this.usernameInput).waitForDisplayed({ timeout: 5000 });
    await $(this.usernameInput).setValue(username);
    await $(this.passwordInput).setValue(password);
    await $(this.loginButton).click();
  }

  async logout() {
    await $(this.menuButton).waitForDisplayed({ timeout: 5000 });
    await $(this.menuButton).click();
    await $(this.logoutMenuItem).waitForDisplayed({ timeout: 5000 });
    await $(this.logoutMenuItem).click();
    await $(this.logoutConfirmationButton).waitForDisplayed({ timeout: 5000 });
    await $(this.logoutConfirmationButton).click();
  }

  async getErrorMessage() {
    return $(this.errorMessage).getText();
  }
}

module.exports = new LoginPage();