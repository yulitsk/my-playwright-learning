import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { validUser } from "../test-data/users";

test.describe("Inventory page regression", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    inventoryPage = new InventoryPage(page);
  });

  test('Cart badge shows correct count after adding products', async ({ page }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await expect(
      inventoryPage.cartBadge, "Cart badge should show 1 after adding 1 product"
    ).toHaveText("1");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await expect(
      inventoryPage.cartBadge, "Cart badge should show 2 after adding 2 products"
    ).toHaveText("2");
  });

   test('Removing a product updates the cart (badge decrements)', async ({ page }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.addProductToCart("Sauce Labs Bike Light");
    await inventoryPage.removeProductFromCart("Sauce Labs Backpack");
    await expect(
      inventoryPage.cartBadge, "Cart badge should show 1 after adding 1 product"
    ).toHaveText("1");

   });  

   test('Removing a product updates the cart (badge disappears)', async ({ page }) => {
    await inventoryPage.addProductToCart("Sauce Labs Backpack");
    await inventoryPage.removeProductFromCart("Sauce Labs Backpack");
    await expect(
      inventoryPage.cartBadge,"Cart badge should not be visible after removing the product"
    ).not.toBeVisible();    
   });  

   //Sorting. Change the product sort order, verify the first product name changes.
  test('Sorting by Price: low to high (verify the first product name changes)', async ({ page }) => {
    await expect(
      inventoryPage.inventoryList.locator(".inventory_item_name").first(),
    "First product should be 'Sauce Labs Backpack' with default sorting").toHaveText("Sauce Labs Backpack");
    await inventoryPage.sortProductsByPriceLowToHigh();
    await expect(
     inventoryPage.inventoryList.locator(".inventory_item_name").first(),
    "First product should be 'Sauce Labs Onesie' after sorting by Price: low to high").toHaveText("Sauce Labs Onesie");
  });

  test('Product prices are displayed in ascending order after sorting by Price: low to high', async ({ page }) => {
    await inventoryPage.sortProductsByPriceLowToHigh();
    const productPrices = await inventoryPage.inventoryList.locator(".inventory_item_price").allTextContents();
    const productPricesNumbers = productPrices.map(price => parseFloat(price.replace("$", "")));
    const sortedPrices = [...productPricesNumbers].sort((a, b) => a - b);
    expect(productPricesNumbers,"Product prices should be in ascending order after sorting by Price: low to high").toEqual(sortedPrices);
  });

  test('Product prices are displayed in descending order after sorting by Price: high to low', async ({ page }) => {
    await inventoryPage.sortProductsByPriceHighToLow();
    const productPrices = await inventoryPage.inventoryList.locator(".inventory_item_price").allTextContents();
    const productPricesNumbers = productPrices.map(price => parseFloat(price.replace("$", "")));
    const sortedPrices = [...productPricesNumbers].sort((a, b) => b - a);
    expect(productPricesNumbers,"Product prices should be in descending order after sorting by Price: high to low").toEqual(sortedPrices);
  });

});