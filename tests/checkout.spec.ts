import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { validUser } from "../test-data/users";
import {validCheckoutInformation} from "../test-data/users";
import { CartPage } from "../pages/CartPage";
import { CheckoutStepOnePage } from "../pages/CheckoutStepOnePage";  
import { CheckoutStepTwoPage } from "../pages/CheckoutStepTwoPage";
import { CheckoutCompletePage } from "../pages/CheckoutCompletePage"; 

test.describe("Checkout flow", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOnePage: CheckoutStepOnePage;
  let checkoutStepTwoPage: CheckoutStepTwoPage;
  let checkoutCompletePage: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(validUser.username, validUser.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOnePage = new CheckoutStepOnePage(page);
    checkoutStepTwoPage = new CheckoutStepTwoPage(page);
    checkoutCompletePage = new CheckoutCompletePage(page);
  });

  test('Verify the success message after completing checkout flow', async ({ page }) => {

    await test.step("Add a product to cart and go to cart", async () => {
      await inventoryPage.addProductToCart("Sauce Labs Backpack");
      await expect(inventoryPage.cartBadge, "Cart badge should show 1 after adding 1 product").toHaveText("1");
      await inventoryPage.openCart();
    });

    await test.step("Verify the URL for the Checkout Step One page", async () => {
      await cartPage.proceedToCheckout();
      await expect(page,"Checkout Step One page should be displayed after clicking the Checkout button").toHaveURL(checkoutStepOnePage.pageURLPattern); // Verify that we are on the Checkout Step One page
    });
    
    await test.step("Verify the user can enter first name, last name, and postal code, and then proceed to the next step", async () => {
      await checkoutStepOnePage.fillCheckoutInformation(validCheckoutInformation.firstName, validCheckoutInformation.lastName, validCheckoutInformation.postalCode);
      await checkoutStepOnePage.continueToCheckoutStepTwo();
      await expect(page,"The Overview page should be displayed after clicking the Continue button").toHaveURL(checkoutStepTwoPage.pageURLPattern); // Verify that we are on the Checkout Step Two page
    });

    await test.step("Verify the Overview page shows the selected product", async () => {
      const productNameLocator = await checkoutStepTwoPage.productNameInCheckout("Sauce Labs Backpack");
      await expect(productNameLocator,"The correct product should be displayed in the checkout summary").toBeVisible(); // Verify that the correct product is displayed in the checkout summary
    });

    await test.step("Verify the Finish button completes the order", async () => {    
      await checkoutStepTwoPage.finishCheckout();
      await expect(page,"Checkout Complete page should be displayed after clicking the Finish button").toHaveURL(checkoutCompletePage.pageURLPattern); 
    });

    await test.step("Verify the success message is visible", async () => {
      await expect(checkoutCompletePage.successMessage,"The Success message should be displayed after completing the checkout").toHaveText(checkoutCompletePage.successMessagePattern); // Verify that the success message is displayed
      await expect(checkoutCompletePage.completeText,"The Order Dispatched text should be displayed on the Checkout Complete page").toHaveText(checkoutCompletePage.completeTextPattern); // Verify that the order dispatched text is displayed
    });

  });

});