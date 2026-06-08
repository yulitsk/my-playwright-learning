import {type Locator, type Page} from "@playwright/test";

export class CheckoutCompletePage {
  readonly page: Page;
  readonly successMessage: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly pageURLPattern = /checkout-complete/;
  readonly successMessagePattern = /Thank you for your order!/;
  readonly completeTextPattern = /Your order has been dispatched, and will arrive just as fast as the pony can get there!/;

  constructor(page: Page) {
    this.page = page;
    this.successMessage = page.locator("[data-test='complete-header']"); 
    this.completeText = page.locator("[data-test='complete-text']");
    this.backHomeButton = page.getByRole("button", { name: "Back Home" });
  }

  async getSuccessMessageText(): Promise<string> {
    return await this.successMessage.textContent() || "";
  }

  async getCompleteText(): Promise<string> {
    return await this.completeText.textContent() || "";
  }

  async goBackToHomePage() {
    await this.backHomeButton.click();
  }
}