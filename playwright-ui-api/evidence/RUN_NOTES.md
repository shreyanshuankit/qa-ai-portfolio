# Playwright demo — run evidence (Portfolio sample)

**This is a portfolio sample, not client work.** These files are evidence from a fresh run of the Playwright suite in this folder. The suite has not been published to GitHub. Public demo targets only: Swag Labs, ReqRes, Restful Booker.

## Full suite (22 tests)

- Date: 13 November 2026, 20:50 IST (Asia/Calcutta)
- Command: `npx playwright test --reporter=list,html`
- Environment: Node.js v24.22.1, @playwright/test 1.65.1, Chromium, Linux
- Outcome: **22 passed, 0 failed, 0 skipped** in **19.2 seconds** (13 UI + 9 API)

See `playwright-html-report.png` and `playwright-html-report-full.png` for the HTML report, `playwright-terminal-results.png` for a capture of the actual CLI output, and `cli-output.txt` for the raw text.

The HTML report clock shows 11/13/2026, 8:50:15 PM, which is the same instant in the box's local zone (Asia/Calcutta).

## Video of two UI tests

A separate run with video and trace enabled (main `playwright.config.ts` was left with `video: 'off'`):

- Date: 13 November 2026, 20:51 IST (Asia/Calcutta)
- Tests: "completes a one-item order and calculates an 8% tax" and "standard_user reaches the inventory with a valid password"
- Outcome: **2 passed** in **2.5 seconds**
- Files: `video-checkout-one-item-order.webm`, `video-login-standard-user.webm`
