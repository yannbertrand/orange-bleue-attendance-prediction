import { Temporal } from 'temporal-polyfill';
import { describe, expect, it } from 'vitest';
import { dateToString, stringToDate } from './date.js';

describe('#dateToString', () => {
  it('should throw if not ZoneDateTime', () => {
    expect(() => dateToString('NOT_VALID')).toThrowError(
      'dateToString only accepts Temporal.ZonedDateTime'
    );
  });

  it('should return string with timezone offset on winter time', () => {
    const winterDateTime = Temporal.ZonedDateTime.from(
      '2025-12-26T12:00:00+01:00[Europe/Paris]'
    );
    expect(dateToString(winterDateTime)).toEqual('2025-12-26T12:00:00+01:00');
  });

  it('should return string with timezone offset on summer time', () => {
    const summerDateTime = Temporal.ZonedDateTime.from(
      '2025-08-08T12:00:00+02:00[Europe/Paris]'
    );
    expect(dateToString(summerDateTime)).toEqual('2025-08-08T12:00:00+02:00');
  });
});

describe('#stringToDate', () => {
  it('should throw if not string', () => {
    expect(() => stringToDate(123)).toThrowError(
      'stringToDate only accepts valid string'
    );
  });

  it('should throw if not valid date', () => {
    expect(() => stringToDate('NOT_VALID')).toThrowError(
      'Cannot parse: NOT_VALID'
    );
  });

  const expectedZonedDateTime = Temporal.ZonedDateTime.from(
    '2025-12-26T12:00:00+01:00[Europe/Paris]'
  );
  it('should parse string with timezone name', () => {
    const dateTimeTimeZoneName = '2025-12-26T12:00:00+01:00[Europe/Paris]';
    expect(stringToDate(dateTimeTimeZoneName)).toEqual(expectedZonedDateTime);
  });

  it('should parse string with timezone offset', () => {
    const dateTimeTimeZoneName = '2025-12-26T12:00:00+01:00';
    expect(stringToDate(dateTimeTimeZoneName)).toEqual(expectedZonedDateTime);
  });

  it('should parse UTC strings', () => {
    const dateTimeAsUtc = '2025-12-26T11:00:00Z';
    expect(stringToDate(dateTimeAsUtc)).toEqual(expectedZonedDateTime);
  });

  it('should parse date without timezone', () => {
    const dateTimeWithoutTimeZone = '2025-12-26T12:00:00';
    expect(stringToDate(dateTimeWithoutTimeZone)).toEqual(
      expectedZonedDateTime
    );
  });

  it('should return winter time ZoneDateTime', () => {
    const winterDateTime = '2025-12-26T12:00:00+01:00[Europe/Paris]';
    expect(stringToDate(winterDateTime)).toEqual(expectedZonedDateTime);
  });

  it('should return summer time ZoneDateTime', () => {
    const summerDateTime = '2025-08-08T12:00:00+02:00[Europe/Paris]';
    expect(stringToDate(summerDateTime)).toEqual(
      Temporal.ZonedDateTime.from('2025-08-08T12:00:00+02:00[Europe/Paris]')
    );
  });
});
