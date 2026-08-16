const APP_ID = 'com.saucelabs.mydemoapp.android';

class CatalogPage {
  constructor() {
    this.catalogTitle = `android=new UiSelector().resourceId("${APP_ID}:id/productTV")`;
    this.productList = `android=new UiSelector().resourceId("${APP_ID}:id/productRV")`;
    this.cartButton = `android=new UiSelector().description("View cart")`;
  }

  async open() {
    await driver.execute('mobile: activateApp', { appId: APP_ID });
    await $(this.catalogTitle).waitForDisplayed({ timeout: 30000 });
  }

  async isCatalogVisible() {
    return $(this.catalogTitle).isDisplayed();
  }

  async getCatalogTitle() {
    return $(this.catalogTitle).getText();
  }

  async isProductListVisible() {
    return $(this.productList).isDisplayed();
  }

  async isCartVisible() {
    return $(this.cartButton).isDisplayed();
  }
}

module.exports = new CatalogPage();
