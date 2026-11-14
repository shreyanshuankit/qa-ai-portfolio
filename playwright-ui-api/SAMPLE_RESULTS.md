# Sample results (local run)

**Sample / Demo.** These results were produced by running this suite locally on Linux. They are not client results and not a performance guarantee for any other environment.

- Date: 13 November 2026, 16:53 IST (Asia/Calcutta)
- Command: `npx playwright test --reporter=list`
- Environment: Node.js v24.22.1, @playwright/test 1.65.0, Chromium 158.0.8127.18, Linux
- Outcome: **22 passed, 0 failed, 0 skipped** in **17.4 seconds** (1 worker)

## UI project (`ui-chromium`) — 13 passed

Targets: https://www.saucedemo.com/

| # | Spec | Result |
|---|------|--------|
| 1 | Checkout — empty customer information is rejected | Passed (647 ms) |
| 2 | Checkout — completes a one-item order and calculates an 8% tax | Passed (777 ms) |
| 3 | Inventory — catalog lists six products with name, price and a loaded image | Passed (461 ms) |
| 4 | Inventory — Price (low to high) sorts catalog prices in ascending order | Passed (555 ms) |
| 5 | Inventory — Name (Z to A) sorts catalog names in descending order | Passed (505 ms) |
| 6 | Inventory — adding two items then removing one updates the cart badge | Passed (521 ms) |
| 7 | Inventory — logout returns the shopper to the login page | Passed (1.4 s) |
| 8 | Session guard — opening /inventory.html while logged out shows a login error | Passed (357 ms) |
| 9 | Login — standard_user reaches the inventory with a valid password | Passed (397 ms) |
| 10 | Login — submitting an empty form shows that a username is required | Passed (423 ms) |
| 11 | Login — invalid credentials show a mismatch error | Passed (377 ms) |
| 12 | Login — locked_out_user is shown the locked-out message | Passed (324 ms) |
| 13 | Login — pressing Enter in the password field submits the form | Passed (383 ms) |

## API project (`api`) — 9 passed

Targets: https://reqres.in and https://restful-booker.herokuapp.com

| # | Spec | Result |
|---|------|--------|
| 14 | ReqRes — GET /api/users/2 returns a known sample user | Passed (402 ms) |
| 15 | ReqRes — GET /api/users?page=2 returns a paginated list | Passed (630 ms) |
| 16 | ReqRes — POST /api/users echoes a created resource | Passed (333 ms) |
| 17 | ReqRes — GET /api/users/23 returns 404 for a missing user | Passed (343 ms) |
| 18 | Restful Booker — GET /booking returns a list of booking ids | Passed (1.5 s) |
| 19 | Restful Booker — POST /auth returns a token for the published demo credentials | Passed (1.3 s) |
| 20 | Restful Booker — POST /booking creates a booking that can be fetched by id | Passed (1.6 s) |
| 21 | Restful Booker — PATCH /booking/:id updates a field on the booking we created | Passed (1.1 s) |
| 22 | Restful Booker — DELETE /booking/:id removes only the booking we created | Passed (1.8 s) |

Public demo APIs can be rate-limited or briefly unavailable. A later run may differ. This run did not use a personal ReqRes key and deleted only the Restful Booker booking it created.
