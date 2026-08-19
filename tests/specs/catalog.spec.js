const CatalogPage = require('../../src/pages/catalog.page');

describe('My Demo App - Catalog', () => {
  beforeEach(async () => {
    await CatalogPage.open();
  });

  it('shows the catalog landing page', async () => {
    await expect(CatalogPage.catalogTitle).toBeDisplayed();
    await expect(CatalogPage.catalogTitle).toHaveText('Products');
    await expect(CatalogPage.productList).toBeDisplayed();
  });

  it('shows the cart action in the header', async () => {
    await expect(CatalogPage.cartButton).toBeDisplayed();
  });
});
