import { Temporal } from 'temporal-polyfill';
import { describe, expect, it } from 'vitest';
import { CustomDate, stringToZonedDateTime } from './date.js';

describe('CustomDate', () => {
  const dateBefore = new CustomDate('2025-01-01T01:00:00Z');
  const myDate = dateBefore.add({ months: 1, days: 11, hours: 11 });
  const dateAfter = myDate.add({ months: 1, days: 9, hours: 11 });

  describe('#isBefore', () => {
    describe('if myDate is after dateB', () => {
      it('should return false', () => {
        expect(myDate.isBefore(dateBefore)).toBe(false);
      });
    });

    describe('if myDate equals dateB', () => {
      it('should return false', () => {
        expect(myDate.isBefore(myDate)).toBe(false);
      });
    });

    describe('if myDate is before dateB', () => {
      it('should return true', () => {
        expect(myDate.isBefore(dateAfter)).toBe(true);
      });
    });
  });

  describe('#isBeforeOrEquals', () => {
    describe('if myDate is after dateB', () => {
      it('should return false', () => {
        expect(myDate.isBeforeOrEquals(dateBefore)).toBe(false);
      });
    });

    describe('if myDate equals dateB', () => {
      it('should return true', () => {
        expect(myDate.isBeforeOrEquals(myDate)).toBe(true);
      });
    });

    describe('if myDate is before dateB', () => {
      it('should return true', () => {
        expect(myDate.isBeforeOrEquals(dateAfter)).toBe(true);
      });
    });
  });

  describe('#isAfter', () => {
    describe('if myDate is after dateB', () => {
      it('should return false', () => {
        expect(myDate.isAfter(dateAfter)).toBe(false);
      });
    });

    describe('if myDate equals dateB', () => {
      it('should return false', () => {
        expect(myDate.isAfter(myDate)).toBe(false);
      });
    });

    describe('if myDate is after dateB', () => {
      it('should return true', () => {
        expect(myDate.isAfter(dateBefore)).toBe(true);
      });
    });
  });

  describe('#isAfterOrEquals', () => {
    describe('if myDate is after dateB', () => {
      it('should return false', () => {
        expect(myDate.isAfterOrEquals(dateAfter)).toBe(false);
      });
    });

    describe('if myDate equals dateB', () => {
      it('should return true', () => {
        expect(myDate.isAfterOrEquals(myDate)).toBe(true);
      });
    });

    describe('if myDate is after dateB', () => {
      it('should return true', () => {
        expect(myDate.isAfterOrEquals(dateBefore)).toBe(true);
      });
    });
  });

  describe('isBetween', () => {
    const dateBeforeBefore = dateBefore.subtract({ days: 1 });
    const dateAfterAfter = dateAfter.add({ days: 1 });
    describe('if date is before dateBefore', () => {
      it('should return false', () => {
        expect(dateBeforeBefore.isBetween(dateBefore, dateAfter)).toBe(false);
      });
    });

    describe('if date is after dateAfter', () => {
      it('should return false', () => {
        expect(dateAfterAfter.isBetween(dateBefore, dateAfter)).toBe(false);
      });
    });

    describe('if date equals dateBefore', () => {
      it('should return true', () => {
        expect(dateBefore.isBetween(dateBefore, dateAfter)).toBe(true);
      });
    });

    describe('if date equals dateAfter', () => {
      it('should return true', () => {
        expect(dateAfter.isBetween(dateBefore, dateAfter)).toBe(true);
      });
    });

    describe('if date is between dateBefore and dateAfter', () => {
      it('should return true', () => {
        expect(myDate.isBetween(dateBefore, dateAfter)).toBe(true);
      });
    });
  });

  describe('toString', () => {
    it('should return date without timezone name', () => {
      expect(
        new CustomDate('2025-12-26T12:00:00+01:00[Europe/Paris]').toString()
      ).toEqual('2025-12-26T12:00:00.000+01:00');
    });

    it('should return string with timezone offset on winter time', () => {
      const winterDateTime = new CustomDate(
        '2025-12-26T12:00:00+01:00[Europe/Paris]'
      );
      expect(winterDateTime.toString()).toEqual(
        '2025-12-26T12:00:00.000+01:00'
      );
    });

    it('should return string with timezone offset on summer time', () => {
      const summerDateTime = new CustomDate(
        '2025-08-08T12:00:00+02:00[Europe/Paris]'
      );
      expect(summerDateTime.toString()).toEqual(
        '2025-08-08T12:00:00.000+02:00'
      );
    });
  });
});

describe('#stringToZonedDateTime', () => {
  it('should throw if not string', () => {
    expect(() => stringToZonedDateTime(123)).toThrowError(
      'stringToZonedDateTime only accepts valid string'
    );
  });

  it('should throw if not valid date', () => {
    expect(() => stringToZonedDateTime('NOT_VALID')).toThrowError(
      'Cannot parse: NOT_VALID'
    );
  });

  const expectedZonedDateTime = Temporal.ZonedDateTime.from(
    '2025-12-26T12:00:00+01:00[Europe/Paris]'
  );
  it('should parse string with timezone offset and timezone name', () => {
    const dateTimeTimeZoneName = '2025-12-26T12:00:00+01:00[Europe/Paris]';
    expect(stringToZonedDateTime(dateTimeTimeZoneName)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should parse string with only timezone offset', () => {
    const dateTimeTimeZoneName = '2025-12-26T12:00:00+01:00';
    expect(stringToZonedDateTime(dateTimeTimeZoneName)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should parse UTC strings', () => {
    const dateTimeAsUtc = '2025-12-26T11:00:00Z';
    expect(stringToZonedDateTime(dateTimeAsUtc)).toEqual(expectedZonedDateTime);
  });

  it('should parse Date strings', () => {
    const dateTimeAsDateString = 'Thu, 26 December 2025 11:00:00 GMT';
    expect(stringToZonedDateTime(dateTimeAsDateString)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should parse date without timezone', () => {
    const dateTimeWithoutTimeZone = '2025-12-26T12:00:00';
    expect(stringToZonedDateTime(dateTimeWithoutTimeZone)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should return winter time ZoneDateTime', () => {
    const winterDateTime = '2025-12-26T12:00:00+01:00[Europe/Paris]';
    expect(stringToZonedDateTime(winterDateTime)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should return summer time ZoneDateTime', () => {
    const summerDateTime = '2025-08-08T12:00:00+02:00[Europe/Paris]';
    expect(stringToZonedDateTime(summerDateTime)).toEqual(
      Temporal.ZonedDateTime.from('2025-08-08T12:00:00+02:00[Europe/Paris]')
    );
  });
});
