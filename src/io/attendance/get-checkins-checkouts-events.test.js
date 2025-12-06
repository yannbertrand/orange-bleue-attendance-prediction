import { Temporal } from 'temporal-polyfill';
import { describe, expect, it } from 'vitest';
import { CustomDate } from '../../utils/date.js';
import { getCheckinsCheckoutsEvents } from './get-checkins-checkouts-events.js';

describe('getCheckinsCheckoutsEvents', () => {
  it('should create one event for checkin', () => {
    expect(
      getCheckinsCheckoutsEvents([
        { checkin: new CustomDate('2025-12-05T06:00:00') },
      ])
    ).toStrictEqual([
      { date: new CustomDate('2025-12-05T06:00:00'), arrived: 1, left: 0 },
    ]);
  });

  it('should create two separate events for checkin and checkouts', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
        },
      ])
    ).toStrictEqual([
      { date: new CustomDate('2025-12-05T06:00:00'), arrived: 1, left: 0 },
      { date: new CustomDate('2025-12-05T08:00:00'), arrived: 0, left: 1 },
    ]);
  });

  it('should create all events needed', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
        },
        {
          checkin: new CustomDate('2025-12-05T09:00:00'),
        },
      ])
    ).toStrictEqual([
      { date: new CustomDate('2025-12-05T06:00:00'), arrived: 1, left: 0 },
      { date: new CustomDate('2025-12-05T08:00:00'), arrived: 0, left: 1 },
      { date: new CustomDate('2025-12-05T09:00:00'), arrived: 1, left: 0 },
    ]);
  });

  it('should sort events', () => {
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: new CustomDate('2025-12-05T06:00:00'),
          checkout: new CustomDate('2025-12-05T08:00:00'),
        },
        {
          checkin: new CustomDate('2025-12-05T07:00:00'),
        },
      ])
    ).toStrictEqual([
      { date: new CustomDate('2025-12-05T06:00:00'), arrived: 1, left: 0 },
      { date: new CustomDate('2025-12-05T07:00:00'), arrived: 1, left: 0 },
      { date: new CustomDate('2025-12-05T08:00:00'), arrived: 0, left: 1 },
    ]);
  });

  it('should filter out future events', () => {
    const now = new CustomDate(Temporal.Now.zonedDateTimeISO());
    expect(
      getCheckinsCheckoutsEvents([
        {
          checkin: now,
          checkout: now.add({ hours: 2 }),
        },
      ])
    ).toStrictEqual([{ date: now, arrived: 1, left: 0 }]);
  });
});
