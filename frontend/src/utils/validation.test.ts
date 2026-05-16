import { describe, expect, it } from 'vitest';

import { isValidEmail, isValidPhone } from './validation';

describe('validation utils', () => {
  it('validates email format', () => {
    expect(isValidEmail('cliente@example.com')).toBe(true);
    expect(isValidEmail('cliente-sin-dominio')).toBe(false);
  });

  it('validates phone numbers with spaces or hyphens', () => {
    expect(isValidPhone('5555-0000')).toBe(true);
    expect(isValidPhone('5555 0000')).toBe(true);
    expect(isValidPhone('123')).toBe(false);
  });
});

