# Restful Booker Postman collection (Portfolio sample)

**This is a portfolio sample, not client work.** It was built as an original demonstration for Shreyanshu Santosh (Senior QA Engineer). It is not a past engagement, and it does not use employer code or data.

Collection v2.1 for the public [Restful Booker](https://restful-booker.herokuapp.com) practice API — the same target as the REST Assured suite. The environment holds the published demo credentials plus two chained variables: `token` (from `POST /auth`) and `bookingid` (from `POST /booking`). Later requests use both.

Do not point this collection at a system you do not own or do not have written permission to test.

## How to run

In the Postman app, import `Restful-Booker.postman_collection.json` and `Restful-Booker.postman_environment.json`, select the environment, and run the collection.

From the CLI (Newman 6+):

```bash
npm install newman newman-reporter-html
npx newman run Restful-Booker.postman_collection.json \
  -e Restful-Booker.postman_environment.json \
  --delay-request 200 \
  -r cli,html \
  --reporter-html-export newman-report.html
```

## Sample results (actual run)

- Date: 13 November 2026, 20:49 IST (Asia/Calcutta)
- Command: `npx newman run Restful-Booker.postman_collection.json -e Restful-Booker.postman_environment.json --delay-request 200 -r cli,html`
- Environment: Newman 4.6.1, Node.js v24.22.1, Linux
- Outcome: **12 requests executed, 0 failed; 18 assertions, 0 failed** in **8.4 seconds**

The raw CLI output is in `newman-cli-report.txt`. The HTML report is `newman-report.html`.


## Requests (run order)

1. Auth — obtain token (published demo credentials)
2. Create booking — store bookingid
3. Get booking by stored bookingid
4. Update booking (PUT) with token cookie
5. Partial update (PATCH) with token cookie
6. List bookings
7. GET unknown booking returns 404
8. PUT without token returns 403
9. DELETE without token returns 403
10. POST booking with missing fields returns 500 (observed demo behaviour)
11. DELETE booking with token returns 201
12. GET after delete returns 404
