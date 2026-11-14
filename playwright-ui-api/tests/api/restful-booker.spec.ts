import { test, expect } from '@playwright/test';
import { API } from '../../src/fixtures/test-data';

/**
 * Public practice API: https://restful-booker.herokuapp.com
 * The suite creates one booking and deletes only that booking.
 * Shared data belonging to other users is never modified.
 */
const jsonHeaders = { 'Content-Type': 'application/json', Accept: 'application/json' };

const newBooking = {
  firstname: 'Sample',
  lastname: 'Tester',
  totalprice: 120,
  depositpaid: true,
  bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
  additionalneeds: 'Breakfast',
};

test.describe.configure({ mode: 'serial' });

test.describe('Restful Booker public practice API', () => {
  let token = '';
  let bookingId = 0;

  test('GET /booking returns a list of booking ids', async ({ request }) => {
    const res = await request.get(`${API.restfulBooker}/booking`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBeGreaterThan(0);
    expect(body[0]).toHaveProperty('bookingid');
  });

  test('POST /auth returns a token for the published demo credentials', async ({ request }) => {
    const res = await request.post(`${API.restfulBooker}/auth`, {
      headers: jsonHeaders,
      data: { username: 'admin', password: 'password123' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.token).toMatch(/^[a-zA-Z0-9]+$/);
    token = body.token;
  });

  test('POST /booking creates a booking that can be fetched by id', async ({ request }) => {
    const create = await request.post(`${API.restfulBooker}/booking`, {
      headers: jsonHeaders,
      data: newBooking,
    });
    expect(create.status()).toBe(200);
    const created = await create.json();
    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking).toMatchObject({
      firstname: 'Sample',
      lastname: 'Tester',
      totalprice: 120,
      depositpaid: true,
    });
    bookingId = created.bookingid;

    const read = await request.get(`${API.restfulBooker}/booking/${bookingId}`, {
      headers: { Accept: 'application/json' },
    });
    expect(read.status()).toBe(200);
    expect(await read.json()).toMatchObject({ firstname: 'Sample', lastname: 'Tester' });
  });

  test('PATCH /booking/:id updates a field on the booking we created', async ({ request }) => {
    expect(token, 'auth token from the previous test').toBeTruthy();
    expect(bookingId, 'booking id from the previous test').toBeGreaterThan(0);
    const res = await request.patch(`${API.restfulBooker}/booking/${bookingId}`, {
      headers: { ...jsonHeaders, Cookie: `token=${token}` },
      data: { additionalneeds: 'Late checkout' },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.additionalneeds).toBe('Late checkout');
    expect(body.firstname).toBe('Sample');
  });

  test('DELETE /booking/:id removes only the booking we created', async ({ request }) => {
    expect(token).toBeTruthy();
    expect(bookingId).toBeGreaterThan(0);
    const res = await request.delete(`${API.restfulBooker}/booking/${bookingId}`, {
      headers: { Cookie: `token=${token}` },
    });
    expect(res.status()).toBe(201);
    const missing = await request.get(`${API.restfulBooker}/booking/${bookingId}`, {
      headers: { Accept: 'application/json' },
    });
    expect(missing.status()).toBe(404);
  });
});
