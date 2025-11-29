import { Temporal } from 'temporal-polyfill';

export function getNow() {
  return Temporal.Now.zonedDateTimeISO('Europe/Paris');
}

export class CustomDate extends Temporal.ZonedDateTime {
  constructor(dateString) {
    let date;
    if (typeof dateString === 'string') {
      date = stringToZonedDateTime(dateString);
    } else if (dateString instanceof CustomDate) {
      date = dateString;
    } else if (dateString instanceof Temporal.ZonedDateTime) {
      date = new CustomDate(dateString.toString());
    } else {
      throw new Error('CustomDate parameter type not handled');
    }

    super(date.epochNanoseconds, date.timeZoneId);
  }

  isBefore(date) {
    return Temporal.ZonedDateTime.compare(this, date) < 0;
  }

  isBeforeOrEquals(date) {
    return Temporal.ZonedDateTime.compare(this, date) <= 0;
  }

  isAfter(date) {
    return Temporal.ZonedDateTime.compare(this, date) > 0;
  }

  isAfterOrEquals(date) {
    return Temporal.ZonedDateTime.compare(this, date) >= 0;
  }

  isBetween(before, after) {
    return this.isAfterOrEquals(before) && this.isBeforeOrEquals(after);
  }

  add(duration) {
    return new CustomDate(super.add(duration).toString());
  }

  subtract(duration) {
    return new CustomDate(super.subtract(duration).toString());
  }

  toString() {
    return super.toString({ timeZoneName: 'never' });
  }
}

export function stringToZonedDateTime(string) {
  if (typeof string !== 'string') {
    throw new Error(
      `stringToZonedDateTime only accepts valid string, invalid value: "${string}"`
    );
  }

  if (string.endsWith('[Europe/Paris]')) {
    return Temporal.ZonedDateTime.from(string);
  } else if (string.endsWith('Z')) {
    return Temporal.Instant.from(string).toZonedDateTimeISO('Europe/Paris');
  } else if (string.includes(' ')) {
    return Temporal.Instant.from(
      new Date(string).toISOString()
    ).toZonedDateTimeISO('Europe/Paris');
  } else {
    return Temporal.PlainDateTime.from(string).toZonedDateTime('Europe/Paris');
  }
}
