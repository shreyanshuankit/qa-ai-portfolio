package com.portfolio.restfulbooker.config;

/**
 * Portfolio sample configuration for the public Restful Booker practice API.
 * Credentials below are the published demo values from the API documentation,
 * not secrets from any employer or client.
 */
public final class ApiConfig {

    public static final String BASE_URI = "https://restful-booker.herokuapp.com";

    /** Published demo username for POST /auth. */
    public static final String DEMO_USERNAME = "admin";

    /** Published demo password for POST /auth. */
    public static final String DEMO_PASSWORD = "password123";

    private ApiConfig() {}
}
