import { Temporal } from 'temporal-polyfill';

export function dateToString(zonedDateTime) {
  if (!(zonedDateTime instanceof Temporal.ZonedDateTime)) {
    throw new Error('dateToString only accepts Temporal.ZonedDateTime');
  }
  return zonedDateTime.toString();
}

export function stringToDate(string) {
  if (typeof string !== 'string') {
    throw new Error('stringToDate only accepts valid string');
  }

  if (string.endsWith('[Europe/Paris]')) {
    return Temporal.ZonedDateTime.from(string);
  } else if (string.endsWith('Z')) {
    return Temporal.Instant.from(string).toZonedDateTimeISO('Europe/Paris');
  } else {
    return Temporal.PlainDateTime.from(string).toZonedDateTime('Europe/Paris');
  }
}
