import { describe, expect, it } from 'vitest';
import { CustomDate } from '../../utils/date.js';
import { toCustomerVisit } from './to-customer-visit.js';

describe('toCustomerVisit', () => {
  it('should return a customer visit', () => {
    const checkin = new CustomDate('2025-12-05T06:00:00');
    const checkout = new CustomDate('2025-12-05T07:00:00');
    expect(
      toCustomerVisit([
        {
          date: checkin,
          type: 'CHECKIN',
          arrived: 1,
          left: 0,
          customer: 1,
          isRealDate: true,
          reason: '',
        },
        {
          date: checkout,
          type: 'CHECKOUT',
          arrived: 0,
          left: 1,
          customer: 1,
          isRealDate: true,
          reason: '',
        },
      ])
    ).toStrictEqual({
      id: 1,
      checkin,
      checkout,
      customer: 1,
      realCheckout: true,
      reason: '',
    });
  });

  it('should copy the checkout realCheckout and reason', () => {
    const checkin = new CustomDate('2025-12-05T06:00:00');
    const checkout = new CustomDate('2025-12-05T07:00:00');
    expect(
      toCustomerVisit([
        {
          date: checkin,
          type: 'CHECKIN',
          arrived: 1,
          left: 0,
          customer: 1,
          isRealDate: true,
          reason: '',
        },
        {
          date: checkout,
          type: 'CHECKOUT',
          arrived: 0,
          left: 1,
          customer: 1,
          isRealDate: false,
          reason: 'VISIT_TIMEOUT',
        },
      ])
    ).toStrictEqual({
      id: 1,
      checkin,
      checkout,
      customer: 1,
      realCheckout: false,
      reason: 'VISIT_TIMEOUT',
    });
  });
});
