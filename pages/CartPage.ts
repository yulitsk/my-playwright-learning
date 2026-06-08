import {type Locator, type Page} from "@playwright/test";

export class CartPage {
  readonly page: Page;
  readonly checkoutButton: Locator;
  readonly cartItems: Locator;
  readonly continueShoppingButton: Locator;
  readonly pageURLPattern = /cart/;

constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator(".cart_item");
    this.checkoutButton = page.getByRole("button", { name: "Checkout" });
    this.continueShoppingButton = page.getByRole("button", { name: "Continue Shopping" });
  }

  async open() {
    await this.page.goto("/cart.html");
  }
  
  async removeProductFromCart(productName: string) {
    const productLocator = this.page.locator(`.cart_item:has-text("${productName}")`);
    await productLocator.getByRole("button", { name: "Remove" }).click();
  }

  async getProductNamesInCart(): Promise<string[]> {
    const productCount = await this.cartItems.count();
    const productNames: string[] = [];
    for (let i = 0; i < productCount; i++) {
      const productName = await this.cartItems.nth(i).locator(".inventory_item_name").textContent();
      if (productName) {
        productNames.push(productName.trim());
      }
    }
    return productNames;
  } 

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async getCartItemsCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
  