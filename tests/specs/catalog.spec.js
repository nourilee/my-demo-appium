const CatalogPage = require('../../src/pages/catalog.page');

describe('My Demo App - Catalog', () => {
  beforeEach(async () => {
    await CatalogPage.open();
  });

  it('shows the catalog landing page', async () => {
    await expect(await CatalogPage.isCatalogVisible()).to.equal(true);
    await expect(await CatalogPage.getCatalogTitle()).to.equal('Products');
    await expect(await CatalogPage.isProductListVisible()).to.equal(true);
  });

  it('shows the cart action in the header', async () => {
    await expect(await CatalogPage.isCartVisible()).to.equal(true);
  });
});
