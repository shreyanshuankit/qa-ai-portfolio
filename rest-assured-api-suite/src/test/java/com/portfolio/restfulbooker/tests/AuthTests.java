package com.portfolio.restfulbooker.tests;

import com.portfolio.restfulbooker.config.ApiConfig;
import com.portfolio.restfulbooker.specs.RequestSpecFactory;
import com.portfolio.restfulbooker.specs.ResponseSpecFactory;
import org.testng.annotations.Test;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.not;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.emptyOrNullString;

/**
 * Portfolio sample: authentication against the public Restful Booker practice API.
 */
public class AuthTests {

    @Test(description = "POST /auth with the published demo credentials returns a token")
    public void validDemoCredentialsReturnToken() {
        given()
                .spec(RequestSpecFactory.base())
                .body("{\"username\":\"" + ApiConfig.DEMO_USERNAME
                        + "\",\"password\":\"" + ApiConfig.DEMO_PASSWORD + "\"}")
                .when()
                .post("/auth")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("token", notNullValue())
                .body("token", not(emptyOrNullString()));
    }

    @Test(description = "POST /auth with invalid credentials returns a Bad credentials reason (HTTP 200)")
    public void invalidCredentialsReturnBadCredentialsReason() {
        // Observed behaviour of this public demo: HTTP 200 and {"reason":"Bad credentials"}.
        given()
                .spec(RequestSpecFactory.base())
                .body("{\"username\":\"not-a-user\",\"password\":\"wrong-password\"}")
                .when()
                .post("/auth")
                .then()
                .spec(ResponseSpecFactory.okJson())
                .body("reason", equalTo("Bad credentials"));
    }
}
