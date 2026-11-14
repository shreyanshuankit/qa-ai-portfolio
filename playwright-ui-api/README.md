# Playwright UI + API demo suite (Portfolio sample)

**This is a portfolio sample, not client work.** It was built as an original demonstration for Shreyanshu Santosh (Senior QA Engineer). It is not a past engagement, and it does not use employer code or data.

The suite covers:

- UI tests against [Swag Labs](https://www.saucedemo.com/), a public Sauce Labs practice shop
- API tests against [ReqRes](https://reqres.in) and [Restful Booker](https://restful-booker.herokuapp.com), both public practice APIs

Do not point this project at a system you do not own or do not have written permission to test.

## Setup

Prerequisites: Node.js 18+ (20 recommended) and npm. From the repository root:

```bash
cd playwright-ui-api
npm ci
npx playwright install chromium
```

## How to run

```bash
npm test              # UI + API (Chromium, one worker)
npm run test:ui       # UI tests only
npm run test:api      # API tests only
npm run report        # open the last HTML report
```

The config uses a single worker and serial API tests so the public demo services are not hammered. ReqRes is called without a personal API key (shared demo limits apply). Restful Booker tests create one booking and delete only that booking.

A sample GitHub Actions workflow for this folder lives at the repository root: `.github/workflows/playwright.yml`. It is stored locally and has not been pushed.

## Structure

```
playwright.config.ts          # Chromium UI project + API project
src/fixtures/test-data.ts     # Public demo usernames / API hosts
src/pages/                    # Page objects for login, inventory, cart, checkout
tests/ui/                     # Login, inventory/cart, checkout
tests/api/                    # ReqRes + Restful Booker
evidence/                     # Screenshots, CLI output, HTML report, and two short videos
```

Published Swag Labs practice accounts (`standard_user`, `locked_out_user`, and others) and the password shown on the login page (`secret_sauce`) are used only against that public demo. Restful Booker uses the published demo credentials (`admin` / `password123`). These are not secrets from any employer or client.

## Sample results

The recorded evidence run is in [evidence/RUN_NOTES.md](./evidence/RUN_NOTES.md):

- Date: 13 November 2026, 20:50 IST (Asia/Calcutta)
- Command: `npx playwright test --reporter=list,html`
- Environment: Node.js v24.22.1, @playwright/test 1.65.1, Chromium, Linux
- Outcome: **22 passed, 0 failed, 0 skipped** in **19.2 seconds** (13 UI + 9 API)

That folder also has CLI output, HTML report screenshots, a standalone HTML report, and two short videos of a login and a one-item checkout (a separate 2-test run at 20:51 IST, both passed in 2.5 seconds).

An earlier local run the same day, also 22/22 passed (17.4 seconds at 16:53 IST), is listed in [SAMPLE_RESULTS.md](./SAMPLE_RESULTS.md).

Public demo APIs can be rate-limited or briefly unavailable. A later run may differ.

## License

MIT. Swag Labs, ReqRes and Restful Booker remain the property of their owners and are used here only as public practice targets.
