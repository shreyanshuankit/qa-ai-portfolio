package com.portfolio.restfulbooker.tests;

import com.portfolio.restfulbooker.specs.RequestSpecFactory;
import com.portfolio.restfulbooker.specs.ResponseSpecFactory;
import com.portfolio.restfulbooker.support.AuthHelper;
import com.portfolio.restfulbooker.support.BookingPayloads;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

/**
 * Portfolio sample: JSON Schema validation of Restful Booker responses.
 */
public class SchemaValidationTests {

    private String token;
    private int bookingId;

    @BeforeClass(alwaysRun = true)
    public void createBookingForSchemaChecks() {
        token = AuthHelper.requestDemoToken();
        bookingId = given()
                .spec(RequestSpecFactory.base())
                .body(BookingPayloads.SAMPLE_CREATE)
                .when()
                .post("/booking")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .extract()
                .path("bookingid");
    }

    @AfterClass(alwaysRun = true)
    public void deleteBooking() {
        if (token != null && bookingId > 0) {
            given()
                    .spec(RequestSpecFactory.withTokenCookie(token))
                    .when()
                    .delete("/booking/{id}", bookingId);
        }
    }

    @Test(description = "POST /booking response body matches the create-booking JSON schema")
    public void createResponseMatchesSchema() {
        given()
                .spec(RequestSpecFactory.base())
                .body(BookingPayloads.create(
                        "Alan", "Turing", 90, true,
                        "2026-11-20", "2026-11-22", "None"))
                .when()
                .post("/booking")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body(matchesJsonSchemaInClasspath("schemas/create-booking-response.json"));
    }

    @Test(description = "GET /booking/{id} body matches the booking JSON schema")
    public void getBookingMatchesSchema() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .get("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body(matchesJsonSchemaInClasspath("schemas/booking.json"));
    }
}
