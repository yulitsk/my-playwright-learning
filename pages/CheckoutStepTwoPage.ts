import {type Locator, type Page} from "@playwright/test";

export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly pageURLPattern = /checkout-step-two/;

  constructor(page: Page) {
    this.page = page;
    this.finishButton = page.getByRole("button", { name: "Finish" });
    this.cancelButton = page.getByRole("button", { name: "Cancel" });
  }

  async productNameInCheckout(productName: string): Promise<Locator> {
    return this.page.locator(`.cart_item:has-text("${productName}") .inventory_item_name`);
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async cancelCheckout() {
    await this.cancelButton.click();
  }
}