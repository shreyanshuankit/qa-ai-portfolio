import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { SAUCE_PASSWORD, SAUCE_USERS } from '../../src/fixtures/test-data';

test.describe('Inventory and cart — standard_user', () => {
  test.beforeEach(async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(SAUCE_USERS.standard, SAUCE_PASSWORD);
    await new InventoryPage(page).expectLoaded();
  });

  test('catalog lists six products with name, price and a loaded image', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await expect(inventory.itemNames).toHaveCount(6);
    await expect(inventory.itemPrices).toHaveCount(6);
    const names = await inventory.itemNames.allTextContents();
    expect(names).toContain('Sauce Labs Backpack');
    const prices = await inventory.itemPrices.allTextContents();
    for (const price of prices) {
      expect(price).toMatch(/^\$\d+\.\d{2}$/);
    }
    const imageState = await inventory.itemImages.evaluateAll((imgs) =>
      imgs.map((img) => {
        const image = img as HTMLImageElement;
        return { complete: image.complete, width: image.naturalWidth, alt: image.alt };
      }),
    );
    expect(imageState).toHaveLength(6);
    for (const img of imageState) {
      expect(img.complete, `image "${img.alt}" should finish loading`).toBe(true);
      expect(img.width, `image "${img.alt}" should have a natural width`).toBeGreaterThan(0);
      expect(img.alt).toBeTruthy();
    }
  });

  test('Price (low to high) sorts catalog prices in ascending order', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sort.selectOption('lohi');
    const prices = (await inventory.itemPrices.allTextContents()).map((p) => Number(p.replace('$', '')));
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('Name (Z to A) sorts catalog names in descending order', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.sort.selectOption('za');
    const names = await inventory.itemNames.allTextContents();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('adding two items then removing one updates the cart badge', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.addToCart('sauce-labs-bike-light');
    await expect(inventory.cartBadge).toHaveText('2');
    await inventory.removeButton('sauce-labs-bike-light').click();
    await expect(inventory.cartBadge).toHaveText('1');
    await inventory.cartLink.click();
    const cart = new CartPage(page);
    await cart.expectLoaded();
    await expect(cart.items).toHaveText(['Sauce Labs Backpack']);
  });

  test('logout returns the shopper to the login page', async ({ page }) => {
    const inventory = new InventoryPage(page);
    await inventory.logout();
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(new LoginPage(page).loginButton).toBeVisible();
  });
});

test.describe('Session guard', () => {
  test('opening /inventory.html while logged out shows a login error', async ({ page }) => {
    const login = new LoginPage(page);
    await page.goto('/inventory.html');
    await expect(login.error).toContainText("You can only access '/inventory.html' when you are logged in.");
    await expect(login.loginButton).toBeVisible();
  });
});
