package com.portfolio.restfulbooker.tests;

import com.portfolio.restfulbooker.specs.RequestSpecFactory;
import com.portfolio.restfulbooker.specs.ResponseSpecFactory;
import com.portfolio.restfulbooker.support.AuthHelper;
import com.portfolio.restfulbooker.support.BookingPayloads;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasKey;
import static org.hamcrest.Matchers.instanceOf;

/**
 * Portfolio sample: booking CRUD flow against the public Restful Booker practice API.
 * Only the booking created in this class is updated or deleted.
 */
public class BookingCrudTests {

    private String token;
    private int bookingId;

    @BeforeClass(alwaysRun = true)
    public void obtainToken() {
        token = AuthHelper.requestDemoToken();
    }

    @Test(description = "GET /booking returns a JSON array of booking id objects")
    public void listBookingsReturnsArrayOfIds() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .get("/booking")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("$", instanceOf(java.util.List.class))
                .body("[0]", hasKey("bookingid"));
    }

    @Test(description = "POST /booking creates a booking and returns a bookingid")
    public void createBookingReturnsId() {
        bookingId = given()
                .spec(RequestSpecFactory.base())
                .body(BookingPayloads.SAMPLE_CREATE)
                .when()
                .post("/booking")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("bookingid", greaterThan(0))
                .body("booking.firstname", equalTo("Ada"))
                .body("booking.lastname", equalTo("Lovelace"))
                .body("booking.totalprice", equalTo(120))
                .body("booking.depositpaid", equalTo(true))
                .body("booking.bookingdates.checkin", equalTo("2026-12-01"))
                .body("booking.bookingdates.checkout", equalTo("2026-12-05"))
                .body("booking.additionalneeds", equalTo("Breakfast"))
                .extract()
                .path("bookingid");
    }

    @Test(description = "GET /booking/{id} returns the booking we created",
            dependsOnMethods = "createBookingReturnsId")
    public void getBookingByIdReturnsCreatedFields() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .get("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("firstname", equalTo("Ada"))
                .body("lastname", equalTo("Lovelace"))
                .body("totalprice", equalTo(120))
                .body("additionalneeds", equalTo("Breakfast"));
    }

    @Test(description = "PUT /booking/{id} with a token cookie fully replaces the booking",
            dependsOnMethods = "getBookingByIdReturnsCreatedFields")
    public void putBookingWithTokenReplacesAllFields() {
        given()
                .spec(RequestSpecFactory.withTokenCookie(token))
                .body(BookingPayloads.SAMPLE_PUT)
                .when()
                .put("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("firstname", equalTo("Grace"))
                .body("lastname", equalTo("Hopper"))
                .body("totalprice", equalTo(200))
                .body("depositpaid", equalTo(false))
                .body("additionalneeds", equalTo("Late checkout"));
    }

    @Test(description = "PATCH /booking/{id} with a token cookie updates one field",
            dependsOnMethods = "putBookingWithTokenReplacesAllFields")
    public void patchBookingWithTokenUpdatesOneField() {
        given()
                .spec(RequestSpecFactory.withTokenCookie(token))
                .body("{\"additionalneeds\":\"Quiet room\"}")
                .when()
                .patch("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("firstname", equalTo("Grace"))
                .body("additionalneeds", equalTo("Quiet room"));
    }

    @Test(description = "DELETE /booking/{id} with a token cookie returns 201 and removes the booking",
            dependsOnMethods = "patchBookingWithTokenUpdatesOneField")
    public void deleteBookingWithTokenReturns201() {
        given()
                .spec(RequestSpecFactory.withTokenCookie(token))
                .when()
                .delete("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.created());
    }

    @Test(description = "GET /booking/{id} after delete returns 404",
            dependsOnMethods = "deleteBookingWithTokenReturns201")
    public void getAfterDeleteReturns404() {
        given()
                .spec(RequestSpecFactory.base())
                .when()
                .get("/booking/{id}", bookingId)
                .then()
                .spec(ResponseSpecFactory.notFound());
    }
}
