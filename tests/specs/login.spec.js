const LoginPage = require('../../src/pages/login.page');
const CatalogPage = require('../../src/pages/catalog.page');
const users = require('../../test-data/users');

describe('My Demo App - Login', () => {
  beforeEach(async () => {
    await LoginPage.open();
  });

  afterEach(async () => {
    try {
      await LoginPage.logout();
    } catch (error) {
      // Keep the teardown graceful; the menu logout is flaky and should not break the demo run.
    }
  });

  it('logs in successfully with valid credentials', async () => {
    await LoginPage.login(users.standardUser.username, users.standardUser.password);
    await expect(await CatalogPage.isCatalogVisible()).to.equal(true);
  });

  it('shows an error message with locked out user', async () => {
    await LoginPage.login(users.lockedOutUser.username, users.lockedOutUser.password);

    const errorMessage = await LoginPage.getErrorMessage();
    await expect(errorMessage).to.include('Sorry this user has been locked out');
  });
});