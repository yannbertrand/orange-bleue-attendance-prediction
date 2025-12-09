import { describe, expect, it } from 'vitest';
import { CustomDate } from '../../utils/date.js';
import { getCheckinsCheckoutsEvents } from './get-checkins-checkouts-events.js';

describe('getCheckinsCheckoutsEvents', () => {
  it('should create two separate events for checkin and checkouts', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
          customer: 'A',
          realCheckout: true,
          reason: '',
        },
      ])
    ).toStrictEqual([
      {
        date: new CustomDate('2025-12-05T06:00:00'),
        type: 'CHECKIN',
        arrived: 1,
        left: 0,
        customer: 'A',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T08:00:00'),
        type: 'CHECKOUT',
        arrived: 0,
        left: 1,
        customer: 'A',
        isRealDate: true,
        reason: '',
      },
    ]);
  });

  it('should create all events needed', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
          customer: 'A',
          realCheckout: false,
          reason: 'DOUBLE_SCAN',
        },
        {
          checkin: new CustomDate('2025-12-05T09:00:00'),
          checkout: new CustomDate('2025-12-05T09:30:00'),
          customer: 'B',
          realCheckout: true,
          reason: '',
        },
      ])
    ).toStrictEqual([
      {
        date: new CustomDate('2025-12-05T06:00:00'),
        type: 'CHECKIN',
        arrived: 1,
        left: 0,
        customer: 'A',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T08:00:00'),
        type: 'CHECKOUT',
        arrived: 0,
        left: 1,
        customer: 'A',
        isRealDate: false,
        reason: 'DOUBLE_SCAN',
      },
      {
        date: new CustomDate('2025-12-05T09:00:00'),
        type: 'CHECKIN',
        arrived: 1,
        left: 0,
        customer: 'B',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T09:30:00'),
        type: 'CHECKOUT',
        arrived: 0,
        left: 1,
        customer: 'B',
        isRealDate: true,
        reason: '',
      },
    ]);
  });

  it('should sort events', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
          customer: 'A',
          realCheckout: true,
          reason: '',
        },
        {
          checkin: new CustomDate('2025-12-05T07:00:00'),
          checkout: new CustomDate('2025-12-05T07:30:00'),
          customer: 'B',
          realCheckout: true,
          reason: '',
        },
      ])
    ).toStrictEqual([
      {
        date: new CustomDate('2025-12-05T06:00:00'),
        type: 'CHECKIN',
        arrived: 1,
        left: 0,
        customer: 'A',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T07:00:00'),
        type: 'CHECKIN',
        arrived: 1,
        left: 0,
        customer: 'B',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T07:30:00'),
        type: 'CHECKOUT',
        arrived: 0,
        left: 1,
        customer: 'B',
        isRealDate: true,
        reason: '',
      },
      {
        date: new CustomDate('2025-12-05T08:00:00'),
        type: 'CHECKOUT',
        arrived: 0,
        left: 1,
        customer: 'A',
        isRealDate: true,
        reason: '',
      },
    ]);
  });
});
