/**
 * Public practice credentials published on https://www.saucedemo.com/.
 * These are not production secrets and are not from any employer or client.
 */
export const SAUCE_USERS = {
  standard: 'standard_user',
  lockedOut: 'locked_out_user',
  problem: 'problem_user',
  performanceGlitch: 'performance_glitch_user',
  error: 'error_user',
  visual: 'visual_user',
} as const;

export const SAUCE_PASSWORD = 'secret_sauce';

export const API = {
  reqres: 'https://reqres.in',
  restfulBooker: 'https://restful-booker.herokuapp.com',
} as const;
