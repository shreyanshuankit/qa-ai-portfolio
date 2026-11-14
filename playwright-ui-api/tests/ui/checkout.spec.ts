import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { CartPage } from '../../src/pages/CartPage';
import { CheckoutPage } from '../../src/pages/CheckoutPage';
import { SAUCE_PASSWORD, SAUCE_USERS } from '../../src/fixtures/test-data';

test.describe('Checkout — standard_user', () => {
  test('empty customer information is rejected', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(SAUCE_USERS.standard, SAUCE_PASSWORD);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.cartLink.click();
    await new CartPage(page).checkoutButton.click();
    const checkout = new CheckoutPage(page);
    await checkout.continueButton.click();
    await expect(checkout.error).toHaveText('Error: First Name is required');
  });

  test('completes a one-item order and calculates an 8% tax', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(SAUCE_USERS.standard, SAUCE_PASSWORD);
    const inventory = new InventoryPage(page);
    await inventory.expectLoaded();
    await inventory.addToCart('sauce-labs-backpack');
    await inventory.cartLink.click();
    await new CartPage(page).checkoutButton.click();

    const checkout = new CheckoutPage(page);
    await checkout.fillInfo('Sample', 'Tester', '226001');
    await checkout.expectOverview();

    await expect(checkout.itemTotal).toHaveText('Item total: $29.99');
    await expect(checkout.tax).toHaveText('Tax: $2.40');
    await expect(checkout.total).toHaveText('Total: $32.39');
    // 29.99 * 0.08 = 2.3992, which the app rounds to $2.40
    await checkout.finish();
    await expect(page).toHaveURL(/checkout-complete/);
  });
});
