import { Temporal } from 'temporal-polyfill';
import { describe, expect, it } from 'vitest';
import { stringToDate } from '../utils/date.js';
import { getActiveCourse } from './get-active-course.js';

describe('getActiveCourse', () => {
  it('should return empty course if none found', () => {
    expect(
      getActiveCourse([], stringToDate('2025-12-26T12:00:00+01:00'))
    ).toStrictEqual(undefined);
  });

  const startDateTime = Temporal.ZonedDateTime.from(
    '2025-12-26T12:00:00+01:00[Europe/Paris]'
  );
  const endDateTime = startDateTime.add({ minutes: 30 });
  it('should return active course if date is equal to startDateTime', () => {
    const dateToTest = startDateTime;

    const activeCourse = {
      startDateTime,
      endDateTime,
    };
    expect(getActiveCourse([activeCourse], dateToTest)).toStrictEqual(
      activeCourse
    );
  });

  it('should return active course if date is equal to endDateTime', () => {
    const dateToTest = endDateTime;

    const activeCourse = {
      startDateTime,
      endDateTime,
    };
    expect(getActiveCourse([activeCourse], dateToTest)).toStrictEqual(
      activeCourse
    );
  });

  it('should return active course if date is between startDateTime and endDateTime', () => {
    const dateToTest = startDateTime.add({ minutes: 15 });

    const activeCourse = {
      startDateTime,
      endDateTime,
    };
    expect(getActiveCourse([activeCourse], dateToTest)).toStrictEqual(
      activeCourse
    );
  });
});
