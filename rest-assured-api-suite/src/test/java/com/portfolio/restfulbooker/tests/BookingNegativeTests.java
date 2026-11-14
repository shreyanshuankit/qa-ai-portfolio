package com.portfolio.restfulbooker.tests;

import com.portfolio.restfulbooker.specs.RequestSpecFactory;
import com.portfolio.restfulbooker.specs.ResponseSpecFactory;
import com.portfolio.restfulbooker.support.AuthHelper;
import com.portfolio.restfulbooker.support.BookingPayloads;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;

/**
 * Portfolio sample: negative cases. Assertions match the observed behaviour
 * of the public Restful Booker practice API (including a 500 on a malformed create).
 */
public class BookingNegativeTests {

    private String token;
    private int bookingId;

    @BeforeClass(alwaysRun = true)
    public void createDisposableBooking() {
        token = AuthHelper.requestDemoToken();
        bookingId = given()
                .spec(RequestSpecFactory.base())
                .body(BookingPayloads.SAMPLE_CREATE)
                .when()
                .post("/booking")
                .then()
                .statusCode(200)
                .extract()
                .path("bookingid");
    }

    @AfterClass(alwaysRun = true)
    public void deleteDisposableBooking() {
        if (token != null && bookingId > 0) {
            given()
                    .spec(RequestSpecFactory.withTokenCookie(token))
                    .when()
                    .delete("/booking/{id}", bookingId);
        }
    }

    @Test(description = "GET /booking/{id} for a non-existent id returns 404")
    public void getUnknownBookingReturns404() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .get("/booking/{id}", 99_999_999)
                .then()
                .spec(ResponseSpecFactory.notFound());
    }

    @Test(description = "PUT /booking/{id} without a token is rejected with 403")
    public void putWithoutTokenReturns403() {
        given()
                .spec(RequestSpecFactory.base())
                .body(BookingPayloads.SAMPLE_PUT)
                .when()
                .put("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.forbidden());
    }

    @Test(description = "DELETE /booking/{id} without a token is rejected with 403")
    public void deleteWithoutTokenReturns403() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .delete("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.forbidden());
    }

    @Test(description = "POST /booking with a missing required body returns 500 (observed demo behaviour)")
    public void createWithMissingFieldsReturns500() {
        // The public demo responds with HTTP 500 and the body "Internal Server Error"
        // rather than a 400. This test documents that observed behaviour.
        given()
                .spec(RequestSpecFactory.base())
                .body("{\"firstname\":\"Only\"}")
                .when()
                .post("/booking")
                .then()
                .statusCode(500);
    }
}
