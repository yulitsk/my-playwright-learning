import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { validUser } from "../test-data/users";
import { CartPage } from "../pages/CartPage";

test.describe("Cart behavior", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('Verify the cart updates after adding and removing products', async ({ page }) => {

    await test.step("Adding multiple products shows correct badge count", async () => {
      await inventoryPage.addProductToCart("Sauce Labs Backpack");
      await inventoryPage.addProductToCart("Sauce Labs Bike Light");
      await expect(
        inventoryPage.cartBadge, "Cart badge should display 2 after adding 2 products"
      ).toHaveText("2");
    });
        
    await test.step("Verify the URL for the Cart page", async () => {
        await inventoryPage.openCart();
        await expect(page,"The Cart page is displayed").toHaveURL(cartPage.pageURLPattern);
    });

   await test.step("Verify the cart shows correct products", async () => {
        const productNamesInCart = await cartPage.getProductNamesInCart();
        expect(productNamesInCart,"Expected products in the cart should match actual").toEqual(expect.arrayContaining(["Sauce Labs Backpack", "Sauce Labs Bike Light"]));
    });

    await test.step("Verify that there are 2 items in the cart", async () => {
        const cartItemsCount = await cartPage.getCartItemsCount();
        await expect(cartItemsCount,"Expected 2 items in the cart").toBe(2);
    });
  
    await test.step("Verify the cart updates after removing a product", async () => {
      await cartPage.removeProductFromCart("Sauce Labs Backpack");
         const productNamesInCart = await cartPage.getProductNamesInCart();
        expect(productNamesInCart,"Expected products in the cart should match actual after removing a product").toEqual(expect.arrayContaining(["Sauce Labs Bike Light"]));
    });

    await test.step("Verify there is 1 item left in the cart", async () => {
        const cartItemsCount = await cartPage.getCartItemsCount();
        expect(cartItemsCount,"Expected 1 item in the cart").toBe(1);
    });
  });

});