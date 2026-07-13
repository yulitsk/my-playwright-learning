import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { InventoryPage } from "../pages/InventoryPage";
import { validUser,lockedUser } from "../test-data/users";

test.describe("Login regression", () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.open();
  });

  test("Happy Path - standard user can log in", async ({ page }) => {
    await loginPage.login(validUser.username, validUser.password);
    inventoryPage = new InventoryPage(page);
    await expect(page,"The Inventory page should be displayed after successful login").toHaveURL(inventoryPage.pageURLPattern);
  });

  test("Locked user sees an error message", async () => {
    await loginPage.login(lockedUser.username, lockedUser.password);
    await expect(loginPage.errorMessage,"Error message should appear for the locked out user").toContainText("this user has been locked out");
  });

  test('Negative path - login with wrong credentials', async () => {
    await loginPage.login(validUser.username, 'wrong_password');
    await expect(loginPage.errorMessage,"Error message should appear on attempt to login with wrong credentials").toContainText( 
      "Username and password do not match any user in this service"
    );
  });

  test('Negative path - Empty form validation - login with empty credentials', async () => {      
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage,"Error message should appear on attempt to login with empty credentials").toContainText( 
      "Username is required"
    );
  });

  test('Negative path - Password is missing - login with username only', async () => {      
    await loginPage.usernameInput.fill(validUser.username);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage,"Error message should appear on attempt to login with username only").toContainText( 
      "Password is required"
    );
  });

  test('Negative path - Username is missing - login with password only', async () => {      
    await loginPage.passwordInput.fill(validUser.password);
    await loginPage.loginButton.click();
    await expect(loginPage.errorMessage,"Error message should appear on attempt to login with password only").toContainText( 
      "Username is required"
    );
  });

});