import { test, expect } from '@playwright/test';
import { API } from '../../src/fixtures/test-data';

/**
 * Public demo API: https://reqres.in
 * Requests are few and serial. The shared demo echoes writes; it does not
 * persist them. No personal API key is used.
 */
const jsonHeaders = { 'Content-Type': 'application/json' };

test.describe.configure({ mode: 'serial' });

test.describe('ReqRes public demo API', () => {
  test('GET /api/users/2 returns a known sample user', async ({ request }) => {
    const res = await request.get(`${API.reqres}/api/users/2`);
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toMatchObject({
      id: 2,
      email: 'janet.weaver@reqres.in',
      first_name: 'Janet',
      last_name: 'Weaver',
    });
    expect(body.data.avatar).toMatch(/^https:\/\//);
  });

  test('GET /api/users?page=2 returns a paginated list', async ({ request }) => {
    const res = await request.get(`${API.reqres}/api/users`, { params: { page: '2' } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThan(body.per_page);
  });

  test('POST /api/users echoes a created resource', async ({ request }) => {
    const res = await request.post(`${API.reqres}/api/users`, {
      headers: jsonHeaders,
      data: { name: 'Sample Tester', job: 'QA Engineer' },
    });
    expect(res.status()).toBe(201);
    const body = await res.json();
    expect(body.name).toBe('Sample Tester');
    expect(body.job).toBe('QA Engineer');
    expect(body.id).toBeTruthy();
    expect(body.createdAt).toBeTruthy();
  });

  test('GET /api/users/23 returns 404 for a missing user', async ({ request }) => {
    const res = await request.get(`${API.reqres}/api/users/23`);
    expect(res.status()).toBe(404);
  });
});
