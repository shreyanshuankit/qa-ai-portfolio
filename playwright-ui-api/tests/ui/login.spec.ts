import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { InventoryPage } from '../../src/pages/InventoryPage';
import { SAUCE_PASSWORD, SAUCE_USERS } from '../../src/fixtures/test-data';

test.describe('Login — Swag Labs (public demo)', () => {
  test('standard_user reaches the inventory with a valid password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(SAUCE_USERS.standard, SAUCE_PASSWORD);
    await new InventoryPage(page).expectLoaded();
  });

  test('submitting an empty form shows that a username is required', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.loginButton.click();
    await expect(login.error).toHaveText('Epic sadface: Username is required');
  });

  test('invalid credentials show a mismatch error', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('not_a_user', 'wrong-password');
    await expect(login.error).toHaveText(
      'Epic sadface: Username and password do not match any user in this service',
    );
  });

  test('locked_out_user is shown the locked-out message', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login(SAUCE_USERS.lockedOut, SAUCE_PASSWORD);
    await expect(login.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    await expect(page).toHaveURL(/saucedemo\.com\/?$/);
  });

  test('pressing Enter in the password field submits the form', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.username.fill(SAUCE_USERS.standard);
    await login.password.fill(SAUCE_PASSWORD);
    await login.password.press('Enter');
    await new InventoryPage(page).expectLoaded();
  });
});
