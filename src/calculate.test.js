import { Temporal } from 'temporal-polyfill';
import { describe, expect, it } from 'vitest';
import { estimateEvolution, simulateOccupation } from './calculate.js';
import { getEventsFromCsv } from './io/read-attendance-events-file.js';
import { CustomDate } from './utils/date.js';

describe('estimateEvolution', () => {
  it('should count visitors arriving', () => {
    const events = getEventsFromCsv(`2025-11-18T06:00:00+01:00,0,,,
2025-11-18T06:30:00+01:00,2,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T06:00:00+01:00[Europe/Paris]'),
        visitors: 0,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T06:30:00+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 2,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors arriving at different times', () => {
    const events = getEventsFromCsv(`2025-11-18T06:00:00+01:00,0,,,
2025-11-18T06:30:00+01:00,2,,,
2025-11-18T07:00:00+01:00,5,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T06:00:00+01:00[Europe/Paris]'),
        visitors: 0,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T06:30:00+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 2,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T07:00:00+01:00[Europe/Paris]'),
        visitors: 5,
        arrived: 3,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors leaving', () => {
    const events = getEventsFromCsv(`2025-11-18T06:30:00+01:00,6,,,
2025-11-18T08:00:00+01:00,2,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T06:30:00+01:00[Europe/Paris]'),
        visitors: 6,
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T08:00:00+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 0,
        left: 4,
        leftOfTimeout: 0,
        leftBeforeTimeout: 4,
      },
    ]);
  });

  it('should count visitors leaving because of 2h timeout', () => {
    const events = getEventsFromCsv(`2025-11-18T06:00:00+01:00,6,,,
2025-11-18T08:00:00+01:00,6,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T06:00:00+01:00[Europe/Paris]'),
        visitors: 6,
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T08:00:00+01:00[Europe/Paris]'),
        visitors: 6,
        arrived: 6,
        left: 6,
        leftOfTimeout: 6,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors leaving at different times', () => {
    const events = getEventsFromCsv(`2025-11-18T06:00:00+01:00,6,,,
2025-11-18T07:30:00+01:00,3,,,
2025-11-18T08:00:00+01:00,2,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T06:00:00+01:00[Europe/Paris]'),
        visitors: 6,
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T07:30:00+01:00[Europe/Paris]'),
        visitors: 3,
        arrived: 0,
        left: 3,
        leftOfTimeout: 0,
        leftBeforeTimeout: 3,
      },
      {
        date: new CustomDate('2025-11-18T08:00:00+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 2,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should return visitors arrivals', () => {
    const events = getEventsFromCsv(`2025-11-18T05:35:59+01:00,0,,,
2025-11-18T06:33:36+01:00,1,,,
2025-11-18T07:08:08+01:00,2,,,
2025-11-18T07:48:49+01:00,2,,,
2025-11-18T08:05:46+01:00,2,,,
2025-11-18T08:28:38+01:00,3,,,
2025-11-18T08:44:14+01:00,5,,,
2025-11-18T09:07:24+01:00,4,,,
2025-11-18T09:31:35+01:00,5,,,
2025-11-18T09:48:05+01:00,8,,,
2025-11-18T10:06:27+01:00,16,7,YAKO PILATES,PLANNED
2025-11-18T10:30:33+01:00,18,5,ABDOS FESSIERS,PLANNED
2025-11-18T10:45:38+01:00,17,5,ABDOS FESSIERS,PLANNED
2025-11-18T11:06:46+01:00,17,,,
2025-11-18T11:30:48+01:00,17,,,
2025-11-18T11:47:12+01:00,20,,,
2025-11-18T12:05:33+01:00,10,,,
2025-11-18T12:27:09+01:00,25,,,
2025-11-18T12:44:04+01:00,26,10,ABDOS FESSIERS,PLANNED
2025-11-18T13:09:06+01:00,26,,,
2025-11-18T13:33:04+01:00,26,,,`);

    expect(estimateEvolution(events)).toStrictEqual([
      {
        date: new CustomDate('2025-11-18T05:35:59+01:00[Europe/Paris]'),
        visitors: 0,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T06:33:36+01:00[Europe/Paris]'),
        visitors: 1,
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T07:08:08+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T07:48:49+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T08:05:46+01:00[Europe/Paris]'),
        visitors: 2,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T08:28:38+01:00[Europe/Paris]'),
        visitors: 3,
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T08:44:14+01:00[Europe/Paris]'),
        visitors: 5,
        arrived: 3,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T09:07:24+01:00[Europe/Paris]'),
        visitors: 4,
        arrived: 0,
        left: 1,
        leftOfTimeout: 0,
        leftBeforeTimeout: 1,
      },
      {
        date: new CustomDate('2025-11-18T09:31:35+01:00[Europe/Paris]'),
        visitors: 5,
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T09:48:05+01:00[Europe/Paris]'),
        visitors: 8,
        arrived: 3,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T10:06:27+01:00[Europe/Paris]'),
        visitors: 16,
        arrived: 8,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T10:30:33+01:00[Europe/Paris]'),
        visitors: 18,
        arrived: 3,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T10:45:38+01:00[Europe/Paris]'),
        visitors: 17,
        arrived: 2,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T11:06:46+01:00[Europe/Paris]'),
        visitors: 17,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T11:30:48+01:00[Europe/Paris]'),
        visitors: 17,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T11:47:12+01:00[Europe/Paris]'),
        visitors: 20,
        arrived: 4,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T12:05:33+01:00[Europe/Paris]'),
        visitors: 10,
        arrived: 0,
        left: 10,
        leftOfTimeout: 3,
        leftBeforeTimeout: 7,
      },
      {
        date: new CustomDate('2025-11-18T12:27:09+01:00[Europe/Paris]'),
        visitors: 25,
        arrived: 16,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T12:44:04+01:00[Europe/Paris]'),
        visitors: 26,
        arrived: 4,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T13:09:06+01:00[Europe/Paris]'),
        visitors: 26,
        arrived: 2,
        left: 2,
        leftOfTimeout: 2,
        leftBeforeTimeout: 0,
      },
      {
        date: new CustomDate('2025-11-18T13:33:04+01:00[Europe/Paris]'),
        visitors: 26,
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
    ]);
  });
});

describe('simulateOccupation', () => {
  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:00:00'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:30:00'),
          arrived: 2,
          left: 0,
        },
      ])
    ).toStrictEqual([0, 2]);
  });

  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:00:00'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:30:00'),
          arrived: 2,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T07:00:00'),
          arrived: 3,
          left: 0,
        },
      ])
    ).toStrictEqual([0, 2, 5]);
  });

  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:30:00'),
          arrived: 6,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:00:00'),
          arrived: 0,
          left: 4,
        },
      ])
    ).toStrictEqual([6, 2]);
  });

  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:00:00'),
          arrived: 6,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:00:00'),
          arrived: 6,
          left: 6,
        },
      ])
    ).toStrictEqual([6, 6]);
  });

  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:00:00'),
          arrived: 6,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T07:30:00'),
          arrived: 0,
          left: 3,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:00:00'),
          arrived: 2,
          left: 3,
        },
      ])
    ).toStrictEqual([6, 3, 2]);
  });

  it('should return original array', () => {
    expect(
      simulateOccupation([
        {
          date: Temporal.PlainDateTime.from('2025-11-18T05:35:59'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T06:33:36'),
          arrived: 1,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T07:08:08'),
          arrived: 1,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T07:48:49'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:05:46'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:28:38'),
          arrived: 1,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T08:44:14'),
          arrived: 3,
          left: 1,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T09:07:24'),
          arrived: 0,
          left: 1,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T09:31:35'),
          arrived: 1,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T09:48:05'),
          arrived: 3,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T10:06:27'),
          arrived: 8,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T10:30:33'),
          arrived: 3,
          left: 1,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T10:45:38'),
          arrived: 2,
          left: 3,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T11:06:46'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T11:30:48'),
          arrived: 0,
          left: 0,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T11:47:12'),
          arrived: 4,
          left: 1,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T12:05:33'),
          arrived: 0,
          left: 10,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T12:27:09'),
          arrived: 16,
          left: 1,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T12:44:04'),
          arrived: 4,
          left: 3,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T13:09:06'),
          arrived: 2,
          left: 2,
        },
        {
          date: Temporal.PlainDateTime.from('2025-11-18T13:33:04'),
          arrived: 0,
          left: 0,
        },
      ])
    ).toStrictEqual([
      0, 1, 2, 2, 2, 3, 5, 4, 5, 8, 16, 18, 17, 17, 17, 20, 10, 25, 26, 26, 26,
    ]);
  });
});
