const LoginPage = require('../../src/pages/login.page');
const CatalogPage = require('../../src/pages/catalog.page');
const users = require('../../test-data/users');

describe('My Demo App - Login', () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  afterEach(async () => {
    // Both tests share one Appium session, so each hands the app back on the
    // login screen. The locked-out test never authenticates, so checking first
    // avoids waiting out a timeout for a Log Out row that cannot appear.
    if (await LoginPage.isLoggedIn()) {
      await LoginPage.logout();
    } else {
      await LoginPage.goToLogin();
    }
  });

  it('logs in successfully with valid credentials', async () => {
    await LoginPage.login(users.standardUser.username, users.standardUser.password);

    await expect(CatalogPage.catalogTitle).toBeDisplayed();
    await expect(CatalogPage.productList).toBeDisplayed();
  });

  it('shows an error message with locked out user', async () => {
    await LoginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);

    await expect(LoginPage.errorMessage).toHaveText('Sorry this user has been locked out', {
      containing: true,
    });
    // The user must be held on the login screen, not just shown a message.
    await expect(LoginPage.loginButton).toBeDisplayed();
    await expect(CatalogPage.catalogTitle).not.toBeDisplayed();
  });
});
