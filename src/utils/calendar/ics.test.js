import { beforeEach, describe, expect, it } from 'vitest';
import { CustomDate } from '../date.js';
import { getCalendar } from './ics.js';

describe('ics', () => {
  let visits, firstVisit;
  beforeEach(() => {
    visits = [
      {
        checkin: new CustomDate('2026-04-17T11:00:30.778+02:00[Europe/Paris]'),
        checkout: new CustomDate('2026-04-17T11:00:30.778+02:00[Europe/Paris]'),
      },
      {
        checkin: new CustomDate('2026-04-18T11:00:30.778+02:00[Europe/Paris]'),
        checkout: new CustomDate('2026-04-18T11:00:30.778+02:00[Europe/Paris]'),
      },
    ];
    firstVisit = visits.at(0);
  });

  it('should use "Muscle" as title', () => {
    const expectedTitle = `Muscle`;

    const response = getCalendar(visits).toString();

    expect(response).toContain(expectedTitle);
  });

  it('should fill the visit start datetime', () => {
    const datetime = getIcsDateTime(firstVisit.checkin);

    const response = getCalendar(visits).toString();

    expect(response).toContain(`DTSTART;TZID=Europe/Paris:${datetime}`);
  });

  it('should fill the visit end datetime', () => {
    const datetime = getIcsDateTime(firstVisit.checkout);

    const response = getCalendar(visits).toString();

    expect(response).toContain(`DTEND;TZID=Europe/Paris:${datetime}`);
  });
});

function getIcsDateTime(instant) {
  const year = instant.year;
  const month = `${instant.month}`.padStart(2, '0');
  const day = `${instant.day}`.padStart(2, '0');
  const hours = `${instant.hour}`.padStart(2, '0');
  const minutes = `${instant.minute}`.padStart(2, '0');

  return `${year}${month}${day}T${hours}${minutes}`;
}
