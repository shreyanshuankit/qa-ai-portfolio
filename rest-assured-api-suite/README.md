# Restful Booker API suite (Portfolio sample)

**This is a portfolio sample, not client work.** It was built as an original demonstration for Shreyanshu Santosh (Senior QA Engineer). It is not a past engagement, and it does not use employer code or data.

The suite tests the public [Restful Booker](https://restful-booker.herokuapp.com) practice API with REST Assured 5.5, TestNG 7.10 and Java 17. ReqRes was checked as an alternative; it still answered a keyless `GET /api/users/2` during setup, but Restful Booker was chosen because it exposes a real auth token, full booking CRUD and useful negative cases without an API key.

Do not point this project at a system you do not own or do not have written permission to test.

## What it covers (15 tests)

- Request and response spec builders (`RequestSpecFactory`, `ResponseSpecFactory`)
- Auth token from `POST /auth` using the **published demo credentials** (`admin` / `password123`)
- Booking CRUD: list, create, get, put, patch, delete, get-after-delete
- JSON Schema validation (`json-schema-validator`) for the create response and a fetched booking
- Negative cases: unknown id (404), put/delete without a token (403), malformed create

One negative test documents an observed quirk of this public demo: `POST /booking` with a missing required body returns **HTTP 500**, not 400. Another implementation note: Rest Assured's default `Content-Type: application/json; charset=UTF-8` makes this API respond **HTTP 418**; the request spec sends `application/json` with no charset.

Only bookings created by the suite are updated or deleted.

## How to run

Prerequisites: JDK 17 and Maven 3.9+.

```bash
cd rest-assured-api-suite
mvn test
```

Surefire + TestNG write results to `target/surefire-reports/`. A compact copy of the last recorded run is in `SUREFIRE_SUMMARY.txt`.

## Sample results (actual run)

- Date: 13 November 2026, 20:48 IST (Asia/Calcutta)
- Command: `mvn test`
- Environment: Eclipse Temurin JDK 17.0.21, Apache Maven 3.9.9, REST Assured 5.5.5, TestNG 7.10.2, Linux
- Outcome: **15 passed, 0 failed, 0 skipped** in **35.68 seconds**

| # | Test | Result |
|---|------|--------|
| 1 | Auth — invalid credentials return `{reason: Bad credentials}` (HTTP 200) | Passed (2.5 s) |
| 2 | Auth — published demo credentials return a token | Passed (1.5 s) |
| 3 | CRUD — POST /booking creates a booking | Passed (1.7 s) |
| 4 | CRUD — GET /booking returns an array of ids | Passed (2.2 s) |
| 5 | CRUD — GET /booking/{id} returns the booking we created | Passed (1.6 s) |
| 6 | CRUD — PUT /booking/{id} with a token replaces all fields | Passed (1.5 s) |
| 7 | CRUD — PATCH /booking/{id} with a token updates one field | Passed (1.4 s) |
| 8 | CRUD — DELETE /booking/{id} with a token returns 201 | Passed (1.5 s) |
| 9 | CRUD — GET after delete returns 404 | Passed (1.6 s) |
| 10 | Schema — POST /booking body matches create-booking schema | Passed (1.6 s) |
| 11 | Schema — GET /booking/{id} body matches booking schema | Passed (1.6 s) |
| 12 | Negative — POST with a missing body returns 500 (observed demo behaviour) | Passed (1.5 s) |
| 13 | Negative — DELETE without a token returns 403 | Passed (1.4 s) |
| 14 | Negative — GET unknown id returns 404 | Passed (1.5 s) |
| 15 | Negative — PUT without a token returns 403 | Passed (1.6 s) |

Public demo APIs can be rate-limited or briefly unavailable. A later run may differ.

## Layout

```
pom.xml
testng.xml
src/test/java/com/portfolio/restfulbooker/
  config/ApiConfig.java
  specs/RequestSpecFactory.java
  specs/ResponseSpecFactory.java
  support/AuthHelper.java
  support/BookingPayloads.java
  tests/AuthTests.java
  tests/BookingCrudTests.java
  tests/SchemaValidationTests.java
  tests/BookingNegativeTests.java
src/test/resources/schemas/
  booking.json
  create-booking-response.json
```
