package com.portfolio.restfulbooker.specs;

import com.portfolio.restfulbooker.config.ApiConfig;
import io.restassured.builder.RequestSpecBuilder;
import io.restassured.config.EncoderConfig;
import io.restassured.config.RestAssuredConfig;
import io.restassured.filter.log.LogDetail;
import io.restassured.http.ContentType;
import io.restassured.specification.RequestSpecification;

/**
 * Reusable request specifications for the portfolio sample suite.
 *
 * The public Restful Booker demo rejects POST /booking with HTTP 418 when the
 * Content-Type header includes a charset (Rest Assured's default). The encoder
 * config below sends {@code application/json} with no charset parameter.
 */
public final class RequestSpecFactory {

    private RequestSpecFactory() {}

    private static RestAssuredConfig noCharsetJson() {
        return RestAssuredConfig.newConfig().encoderConfig(
                EncoderConfig.encoderConfig()
                        .appendDefaultContentCharsetToContentTypeIfUndefined(false)
                        .encodeContentTypeAs("application/json", ContentType.JSON));
    }

    public static RequestSpecification base() {
        return new RequestSpecBuilder()
                .setConfig(noCharsetJson())
                .setBaseUri(ApiConfig.BASE_URI)
                .setContentType("application/json")
                .setAccept("application/json")
                .log(LogDetail.METHOD)
                .log(LogDetail.URI)
                .build();
    }

    public static RequestSpecification withTokenCookie(String token) {
        return new RequestSpecBuilder()
                .addRequestSpecification(base())
                .addCookie("token", token)
                .build();
    }
}
