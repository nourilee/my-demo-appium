const APP_ID = 'com.saucelabs.mydemoapp.android';

// Cold start covers launching the app on a fresh session.
const COLD_START_WAIT = 30000;

class CatalogPage {
  get catalogTitle() {
    return $(`id=${APP_ID}:id/productTV`);
  }

  get productList() {
    return $(`id=${APP_ID}:id/productRV`);
  }

  get cartButton() {
    return $('~View cart');
  }

  async open() {
    await driver.execute('mobile: activateApp', { appId: APP_ID });
    await this.catalogTitle.waitForDisplayed({ timeout: COLD_START_WAIT });
  }
}

module.exports = new CatalogPage();
