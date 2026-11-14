import { type Locator, type Page, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly list: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly itemImages: Locator;
  readonly sort: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.list = page.locator('.inventory_list');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.itemImages = page.locator('.inventory_item img');
    this.sort = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator('.shopping_cart_link');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async expectLoaded() {
    await expect(this.page).toHaveURL(/inventory\.html/);
    await expect(this.list).toBeVisible();
  }

  addToCartButton(itemSlug: string) {
    return this.page.locator(`[data-test="add-to-cart-${itemSlug}"]`);
  }

  removeButton(itemSlug: string) {
    return this.page.locator(`[data-test="remove-${itemSlug}"]`);
  }

  async addToCart(itemSlug: string) {
    await this.addToCartButton(itemSlug).click();
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
