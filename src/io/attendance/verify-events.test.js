import { describe, expect, it } from 'vitest';
import { CustomDate } from '../../utils/date.js';
import { verifyEvents } from './verify-events.js';

describe('verifyEvents', () => {
  it('should throw if odd number of visits', () => {
    expect(() =>
      verifyEvents([
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
          date: new CustomDate('2025-12-05T06:01:00'),
          type: 'CHECKOUT',
          arrived: 0,
          left: 1,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
        {
          date: new CustomDate('2025-12-05T06:02:00'),
          type: 'CHECKIN',
          arrived: 1,
          left: 0,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
      ])
    ).toThrowError('Customer day events count is odd');
  });

  it('should throw if unlogical events series', () => {
    expect(() =>
      verifyEvents([
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
          date: new CustomDate('2025-12-05T06:01:00'),
          type: 'CHECKIN',
          arrived: 1,
          left: 0,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
      ])
    ).toThrowError('Duplicate event types');
  });

  it('should throw if multiple checkins in less than official estimated visit duration', () => {
    expect(() =>
      verifyEvents([
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
          date: new CustomDate('2025-12-05T06:01:00'),
          type: 'CHECKOUT',
          arrived: 1,
          left: 0,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
        {
          date: new CustomDate('2025-12-05T06:02:00'),
          type: 'CHECKIN',
          arrived: 1,
          left: 0,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
        {
          date: new CustomDate('2025-12-05T06:03:00'),
          type: 'CHECKOUT',
          arrived: 1,
          left: 0,
          customer: 'A',
          isRealDate: true,
          reason: '',
        },
      ])
    ).toThrowError(
      'Too much checkins in less than official estimated visit duration'
    );
  });
});
