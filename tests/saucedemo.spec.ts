import { test, expect } from '@playwright/test';
import { Page } from '@playwright/test';
import { validUser,lockedUser } from './test-data';

test.describe("SauceDemo", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');    
  });

async function login(page: Page): Promise<void> {
  await page.getByPlaceholder("Username").fill(validUser.username);
  await page.getByPlaceholder("Password").fill(validUser.password); 
  await page.getByRole("button", { name: "Login" }).click(); 
  }

test('Happy Path - login with correct credentials', async ({ page }) => {  
  login(page);    
  await expect(page).toHaveURL(/inventory/);
  await expect(page).toHaveTitle("Swag Labs");
  await expect(page.getByText("Products")).toBeVisible();
  });

test('Negative login - login with wrong credentials', async ({ page }) => {   
  await page.getByPlaceholder("Username").fill(validUser.username);
  await page.getByPlaceholder("Password").fill('wrong_password');
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator("[data-test='error']"),"Error message shows up when login fails.").toContainText( 
    "Username and password do not match any user in this service"
  );
});

test('Empty form validation - login with empty credentials', async ({ page }) => {      
  await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator("[data-test='error']"),"Error message shows up on attempt to login with empty credentials.").toContainText( 
    "Username is required"
  );
});

test('Password is missing - login with username only', async ({ page }) => {      
  await page.getByPlaceholder("Username").fill(validUser.username);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator("[data-test='error']"),"Error message shows up on attempt to login with valid username and empty password.").toContainText( 
    "Password is required"
  );
});

test('Username is missing - login with password only', async ({ page }) => {      
  await page.getByPlaceholder("Password").fill(validUser.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator("[data-test='error']"),"Error message shows up on attempt to login with empty username and valid password.").toContainText( 
    "Username is required"
  );
});

test('Add to cart - add a product to the cart and verify it', async ({ page }) => {
  login(page); 
  await page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click(); // Unique locator (verified that Length 1)
  await expect(
    page.locator(".shopping_cart_badge"), "Cart badge should show 1 after adding a product"
  ).toHaveText("1");
  });

test('Remove from cart - remove a product from the cart and verify it', async ({ page }) => {
  login(page); 
  await page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click(); // Unique locator (verified that Length 1)
  await expect(
    page.locator(".shopping_cart_badge"), "Cart badge should show 1 after adding a product"
  ).toHaveText("1");
  await page.locator("[data-test='remove-sauce-labs-backpack']").click(); // Unique locator (verified that Length 1)
  await expect(
    page.locator(".shopping_cart_badge"),"Cart badge should not be visible after removing the product"
  ).not.toBeVisible();
  });

test.skip('Skipped (known bug): Checkout button is not displayed in the empty cart', async ({ page }) => {
  login(page); 
  await expect(
    page.locator(".shopping_cart_badge"),
    "Cart badge is not displayed if Cart is empty"
  ).not.toBeVisible();
    await page.locator("[data-test='shopping-cart-link']").click(); // Unique locator (verified that Length 1)
    await expect(page).toHaveURL(/cart/); // Verify that we are on the Cart page
    await expect(
    page.getByRole("button", { name: "Checkout" }),
    "Checkout button should not be visible in the empty Cart"
  ).not.toBeVisible();
  });

test('Add 3 products to cart, remove 1 from cart, and verify the cart count', async ({ page }) => {
  login(page); 
  await page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click(); // Unique locator (verified that Length 1)
  await page.locator("[data-test='add-to-cart-sauce-labs-bike-light']").click(); // Unique locator (verified that Length 1)
  await page.locator("[data-test='add-to-cart-sauce-labs-bolt-t-shirt']").click(); // Unique locator (verified that Length 1)
  await expect(
    page.locator(".shopping_cart_badge"),
  "Cart badge should show 3 after adding three products").toHaveText("3");
  await page.locator("[data-test='remove-sauce-labs-backpack']").click(); // Unique locator (verified that Length 1)
  await expect(
    page.locator(".shopping_cart_badge"),
  "Cart badge should show 2 after removing a product").toHaveText("2");
  });

test('State after refresh: add a product, refresh the page', async ({ page }) => {
  login(page); 
  await page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click(); 
  await page.locator("[data-test='shopping-cart-link']").click(); 
  await expect(page).toHaveURL(/cart/);
  await expect(
    page.locator("[data-test='item-4-title-link']"),
  "Added product should be visible in the cart").toBeVisible();
  await page.reload(); // Reload the page to verify that the cart count is preserved after page reload
  await expect(
    page.locator(".shopping_cart_badge"),
  "Cart badge should show 1 after page reload").toHaveText("1");
  await expect(
    page.locator("[data-test='item-4-title-link']"),
  "Added product is still visible in the cart after page reload").toBeVisible();
  });

//Sorting. Change the product sort order, verify the first product name changes.
test('Sorting by Price: low to high', async ({ page }) => {
  login(page);
  await expect(
    page.locator("[data-test='inventory-list']").locator(".inventory_item_name").first(),
  "First product should be Sauce Labs Backpack with default sorting").toHaveText("Sauce Labs Backpack");
  await page.locator('[data-test="product-sort-container"]').click(); // Click to open the sorting dropdown
  await page.locator('[data-test="product-sort-container"]').selectOption({ value: "lohi" }); // Select "Price (low to high)" option from the dropdown
  await expect(
    page.locator("[data-test='inventory-list']").locator(".inventory_item_name").first(),
  "First product should be Sauce Labs Onesie after sorting by Price: low to high").toHaveText("Sauce Labs Onesie");
  });

test('Locked user login - login with locked credentials', async ({ page }) => {   
  await page.getByPlaceholder("Username").fill(lockedUser.username);
  await page.getByPlaceholder("Password").fill(lockedUser.password);
  await page.getByRole('button', { name: 'Login' }).click();
  await expect(page.locator("[data-test='error']"),"Error message shows up when locked user attempts to login.").toHaveText( 
    "Epic sadface: Sorry, this user has been locked out."
  );
});

});