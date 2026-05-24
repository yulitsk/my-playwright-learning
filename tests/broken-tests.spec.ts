import { test, expect } from "@playwright/test";

test.describe("SauceDemo - Broken tests", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');    
  });

/*
Root cause: the element with placeholder "User Name" has not been found. 
Fix: The correct placeholder is "Username" without space.
How I verified: I ran the test and it passed successfully after the fix. 
*/
test("login should redirect to inventory", async ({ page }) => {
  await page.getByPlaceholder("Username").fill("standard_user");   
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page).toHaveURL(/inventory/);
  });

/*
Root cause: Locator getByTestId('error') with expected text "Username and password do not match any user in this service" has not been found
Fix:  I changed getByTestId("error")) to locator("[data-test='error']") and changed 'toHaveText' to 'toContainText' to check that the error message contains the expected text instead of matching it exactly.
How I verified: I ran the test and it passed successfully after the fix. 
*/
test("error message on wrong password", async ({ page }) => {
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("wrong_password");
  await page.getByRole("button", { name: "Login" }).click();
  await expect(page.locator("[data-test='error']")).toContainText( 
    "Username and password do not match any user in this service"   // The actual error message is "Epic sadface: Username and password do not match any user in this service"
  );
  });
 
/*
Root cause: 'await' was missing before page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click() which caused the test to fail as it did not wait for the click action to complete before checking the cart badge.
Fix: I added the missing 'await' 
How I verified: I ran the test multiple times and it passed successfully after the fix: 'npx playwright test --repeat-each=5'
*/
test("cart badge appears after adding product", async ({ page }) => {
  await page.getByPlaceholder("Username").fill("standard_user");
  await page.getByPlaceholder("Password").fill("secret_sauce");
  await page.getByRole("button", { name: "Login" }).click();
  await page.locator("[data-test='add-to-cart-sauce-labs-backpack']").click(); 
  await expect(page.locator(".shopping_cart_badge")).toHaveText("1");
  });
});