# Final Project — Playwright Test Suite

## Test target
SauceDemo (https://www.saucedemo.com)

## Covered user journey
Track A — SauceDemo (recommended default)
Journey: login → add products → cart → checkout

## Test cases
- Valid user can log in
- Locked user cannot log in
- Login fails if password is wrong
- Login fails if username or password are missing
- User can add product to cart
- User can remove product from cart
- User can sort products by price
- User can complete checkout and see success message

## Project structure
- `pages/` — Page Object classes (LoginPage, InventoryPage, CartPage, CheckoutPage)
- `tests/` — test specs (*.spec.ts)
- `test-data/` — credentials and test inputs
- `playwright.config.ts` — configuration

## How to run
```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

## Notes
- No hard waits (`waitForTimeout`) are used
- Tests use semantic locators (`getByRole`, `getByTestId`, `getByPlaceholder`)
- Test data is stored separately from test logic

## Known limitations
- This suite covers only the selected user journey
- It does not cover all possible edge cases