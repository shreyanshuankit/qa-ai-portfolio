package com.portfolio.restfulbooker.support;

/** JSON payloads for Restful Booker booking requests. Portfolio sample only. */
public final class BookingPayloads {

    private BookingPayloads() {}

    public static String create(String first, String last, int price, boolean deposit,
                                String checkin, String checkout, String needs) {
        return """
                {
                  "firstname": "%s",
                  "lastname": "%s",
                  "totalprice": %d,
                  "depositpaid": %s,
                  "bookingdates": {
                    "checkin": "%s",
                    "checkout": "%s"
                  },
                  "additionalneeds": "%s"
                }
                """.formatted(first, last, price, deposit, checkin, checkout, needs);
    }

    public static final String SAMPLE_CREATE = create(
            "Ada", "Lovelace", 120, true,
            "2026-12-01", "2026-12-05", "Breakfast");

    public static final String SAMPLE_PUT = create(
            "Grace", "Hopper", 200, false,
            "2026-12-10", "2026-12-12", "Late checkout");
}
