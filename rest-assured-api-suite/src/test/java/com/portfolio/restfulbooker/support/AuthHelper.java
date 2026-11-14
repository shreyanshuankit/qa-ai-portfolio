package com.portfolio.restfulbooker.support;

import com.portfolio.restfulbooker.config.ApiConfig;
import com.portfolio.restfulbooker.specs.RequestSpecFactory;
import io.restassured.http.ContentType;

import static io.restassured.RestAssured.given;

/** Obtains a token from the public demo /auth endpoint. */
public final class AuthHelper {

    private AuthHelper() {}

    public static String requestDemoToken() {
        return given()
                .spec(RequestSpecFactory.base())
                .body("{\"username\":\"" + ApiConfig.DEMO_USERNAME
                        + "\",\"password\":\"" + ApiConfig.DEMO_PASSWORD + "\"}")
                .when()
                .post("/auth")
                .then()
                .statusCode(200)
                .contentType(ContentType.JSON)
                .extract()
                .path("token");
    }
}
