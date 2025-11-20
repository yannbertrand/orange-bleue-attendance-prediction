import { describe, expect, it } from 'vitest';
import { estimateEvolution, simulateOccupation } from './calculate.js';
import { getEventsFromCsv } from './read-data.js';

describe('estimateEvolution', () => {
  it('should count visitors arriving', () => {
    const csvData = getEventsFromCsv(`2025-11-18T05:00:00.000Z,0,,,
2025-11-18T05:30:00.000Z,2,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T05:00:00.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T05:30:00.000Z'),
        arrived: 2,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors arriving at different times', () => {
    const csvData = getEventsFromCsv(`2025-11-18T05:00:00.000Z,0,,,
2025-11-18T05:30:00.000Z,2,,,
2025-11-18T06:00:00.000Z,5,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T05:00:00.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T05:30:00.000Z'),
        arrived: 2,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T06:00:00.000Z'),
        arrived: 3,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors leaving', () => {
    const csvData = getEventsFromCsv(`2025-11-18T05:30:00.000Z,6,,,
2025-11-18T07:00:00.000Z,2,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T05:30:00.000Z'),
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T07:00:00.000Z'),
        arrived: 0,
        left: 4,
        leftOfTimeout: 0,
        leftBeforeTimeout: 4,
      },
    ]);
  });

  it('should count visitors leaving because of 2h timeout', () => {
    const csvData = getEventsFromCsv(`2025-11-18T05:00:00.000Z,6,,,
2025-11-18T07:00:00.000Z,6,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T05:00:00.000Z'),
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T07:00:00.000Z'),
        arrived: 6,
        left: 6,
        leftOfTimeout: 6,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should count visitors leaving at different times', () => {
    const csvData = getEventsFromCsv(`2025-11-18T05:00:00.000Z,6,,,
2025-11-18T06:30:00.000Z,3,,,
2025-11-18T07:00:00.000Z,2,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T05:00:00.000Z'),
        arrived: 6,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T06:30:00.000Z'),
        arrived: 0,
        left: 3,
        leftOfTimeout: 0,
        leftBeforeTimeout: 3,
      },
      {
        date: new Date('2025-11-18T07:00:00.000Z'),
        arrived: 2,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
    ]);
  });

  it('should return visitors arrivals', () => {
    const csvData = getEventsFromCsv(`2025-11-18T04:35:59.000Z,0,,,
2025-11-18T05:33:36.000Z,1,,,
2025-11-18T06:08:08.000Z,2,,,
2025-11-18T06:48:49.000Z,2,,,
2025-11-18T07:05:46.000Z,2,,,
2025-11-18T07:28:38.000Z,3,,,
2025-11-18T07:44:14.000Z,5,,,
2025-11-18T08:07:24.000Z,4,,,
2025-11-18T08:31:35.000Z,5,,,
2025-11-18T08:48:05.000Z,8,,,
2025-11-18T09:06:27.000Z,16,7,YAKO PILATES,PLANNED
2025-11-18T09:30:33.000Z,18,5,ABDOS FESSIERS,PLANNED
2025-11-18T09:45:38.000Z,17,5,ABDOS FESSIERS,PLANNED
2025-11-18T10:06:46.000Z,17,,,
2025-11-18T10:30:48.000Z,17,,,
2025-11-18T10:47:12.000Z,20,,,
2025-11-18T11:05:33.000Z,10,,,
2025-11-18T11:27:09.000Z,25,,,
2025-11-18T11:44:04.000Z,26,10,ABDOS FESSIERS,PLANNED
2025-11-18T12:09:06.000Z,26,,,
2025-11-18T12:33:04.000Z,26,,,`);

    expect(estimateEvolution(csvData)).toStrictEqual([
      {
        date: new Date('2025-11-18T04:35:59.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T05:33:36.000Z'),
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T06:08:08.000Z'),
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T06:48:49.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T07:05:46.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T07:28:38.000Z'),
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T07:44:14.000Z'),
        arrived: 3,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T08:07:24.000Z'),
        arrived: 0,
        left: 1,
        leftOfTimeout: 0,
        leftBeforeTimeout: 1,
      },
      {
        date: new Date('2025-11-18T08:31:35.000Z'),
        arrived: 1,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T08:48:05.000Z'),
        arrived: 3,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T09:06:27.000Z'),
        arrived: 8,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T09:30:33.000Z'),
        arrived: 3,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T09:45:38.000Z'),
        arrived: 2,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T10:06:46.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T10:30:48.000Z'),
        arrived: 0,
        left: 0,
        leftOfTimeout: 0,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T10:47:12.000Z'),
        arrived: 4,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T11:05:33.000Z'),
        arrived: 0,
        left: 10,
        leftOfTimeout: 3,
        leftBeforeTimeout: 7,
      },
      {
        date: new Date('2025-11-18T11:27:09.000Z'),
        arrived: 16,
        left: 1,
        leftOfTimeout: 1,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T11:44:04.000Z'),
        arrived: 4,
        left: 3,
        leftOfTimeout: 3,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T12:09:06.000Z'),
        arrived: 2,
        left: 2,
        leftOfTimeout: 2,
        leftBeforeTimeout: 0,
      },
      {
        date: new Date('2025-11-18T12:33:04.000Z'),
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
          date: new Date('2025-11-18T05:00:00.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T05:30:00.000Z'),
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
          date: new Date('2025-11-18T05:00:00.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T05:30:00.000Z'),
          arrived: 2,
          left: 0,
        },
        {
          date: new Date('2025-11-18T06:00:00.000Z'),
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
          date: new Date('2025-11-18T05:30:00.000Z'),
          arrived: 6,
          left: 0,
        },
        {
          date: new Date('2025-11-18T07:00:00.000Z'),
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
          date: new Date('2025-11-18T05:00:00.000Z'),
          arrived: 6,
          left: 0,
        },
        {
          date: new Date('2025-11-18T07:00:00.000Z'),
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
          date: new Date('2025-11-18T05:00:00.000Z'),
          arrived: 6,
          left: 0,
        },
        {
          date: new Date('2025-11-18T06:30:00.000Z'),
          arrived: 0,
          left: 3,
        },
        {
          date: new Date('2025-11-18T07:00:00.000Z'),
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
          date: new Date('2025-11-18T04:35:59.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T05:33:36.000Z'),
          arrived: 1,
          left: 0,
        },
        {
          date: new Date('2025-11-18T06:08:08.000Z'),
          arrived: 1,
          left: 0,
        },
        {
          date: new Date('2025-11-18T06:48:49.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T07:05:46.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T07:28:38.000Z'),
          arrived: 1,
          left: 0,
        },
        {
          date: new Date('2025-11-18T07:44:14.000Z'),
          arrived: 3,
          left: 1,
        },
        {
          date: new Date('2025-11-18T08:07:24.000Z'),
          arrived: 0,
          left: 1,
        },
        {
          date: new Date('2025-11-18T08:31:35.000Z'),
          arrived: 1,
          left: 0,
        },
        {
          date: new Date('2025-11-18T08:48:05.000Z'),
          arrived: 3,
          left: 0,
        },
        {
          date: new Date('2025-11-18T09:06:27.000Z'),
          arrived: 8,
          left: 0,
        },
        {
          date: new Date('2025-11-18T09:30:33.000Z'),
          arrived: 3,
          left: 1,
        },
        {
          date: new Date('2025-11-18T09:45:38.000Z'),
          arrived: 2,
          left: 3,
        },
        {
          date: new Date('2025-11-18T10:06:46.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T10:30:48.000Z'),
          arrived: 0,
          left: 0,
        },
        {
          date: new Date('2025-11-18T10:47:12.000Z'),
          arrived: 4,
          left: 1,
        },
        {
          date: new Date('2025-11-18T11:05:33.000Z'),
          arrived: 0,
          left: 10,
        },
        {
          date: new Date('2025-11-18T11:27:09.000Z'),
          arrived: 16,
          left: 1,
        },
        {
          date: new Date('2025-11-18T11:44:04.000Z'),
          arrived: 4,
          left: 3,
        },
        {
          date: new Date('2025-11-18T12:09:06.000Z'),
          arrived: 2,
          left: 2,
        },
        {
          date: new Date('2025-11-18T12:33:04.000Z'),
          arrived: 0,
          left: 0,
        },
      ])
    ).toStrictEqual([
      0, 1, 2, 2, 2, 3, 5, 4, 5, 8, 16, 18, 17, 17, 17, 20, 10, 25, 26, 26, 26,
    ]);
  });
});
