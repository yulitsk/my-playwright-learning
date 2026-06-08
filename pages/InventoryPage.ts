import {type Locator, type Page} from "@playwright/test";

export class InventoryPage {
  readonly page: Page;
  readonly inventoryList: Locator;
  readonly cartBadge: Locator;
  readonly sortDropdown: Locator;
  readonly cartLink: Locator;
  readonly pageURLPattern = /inventory/;

  constructor(page: Page) {
    this.page = page;
    this.inventoryList = page.locator("[data-test='inventory-list']");
    this.cartBadge = page.locator(".shopping_cart_badge");
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.cartLink = page.locator("[data-test='shopping-cart-link']")
  }

  async open() {
    await this.page.goto("/inventory.html");
  }

  async openCart() {
    await this.cartLink.click();
  }

  async addProductToCart(productName: string) {
    const productLocator = this.page.locator(`.inventory_item:has-text("${productName}")`);
    await productLocator.getByRole("button", { name: "Add to cart" }).click();
  }

  async removeProductFromCart(productName: string) {
    const productLocator = this.page.locator(`.inventory_item:has-text("${productName}")`);
    await productLocator.getByRole("button", { name: "Remove" }).click();
  }

  async sortProductsByPriceLowToHigh() {
    await this.sortDropdown.click(); // Click to open the sorting dropdown
    await this.sortDropdown.selectOption({ value: "lohi" }); // Select "Price (low to high)" option from the dropdown
  } 

  async sortProductsByPriceHighToLow() {
    await this.sortDropdown.click(); // Click to open the sorting dropdown
    await this.sortDropdown.selectOption({ value: "hilo" }); // Select "Price (high to low)" option from the dropdown
  }

}   