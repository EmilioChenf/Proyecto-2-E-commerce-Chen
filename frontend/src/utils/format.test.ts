import { describe, expect, it } from 'vitest';

import { formatCurrencyGTQ } from './format';

describe('formatCurrencyGTQ', () => {
  it('formats numeric values as Guatemalan quetzales', () => {
    expect(formatCurrencyGTQ(1234.5)).toBe('Q 1,234.50');
  });

  it('formats nullish values as zero', () => {
    expect(formatCurrencyGTQ(null)).toBe('Q 0.00');
    expect(formatCurrencyGTQ(undefined)).toBe('Q 0.00');
  });
});

