import http from 'http';
import ical, { ICalCalendarMethod } from 'ical-generator';

/**
 *
 * @param {Object[]} visits
 * @returns
 */
export function getCalendar(visits) {
  const calendar = ical({
    name: 'Muscle',
    timezone: 'Europe/Paris',
  });
  calendar.method(ICalCalendarMethod.PUBLISH);

  for (const visit of visits) {
    calendar.createEvent({
      start: visit.checkin,
      end: visit.checkout,
      summary: `Muscle`,
      timezone: 'Europe/Paris',
    });
  }

  return calendar;
}

/**
 * @param {Object} calendar
 */
export function startServer(calendar) {
  http
    .createServer((request, response) => {
      response.writeHead(200, {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Content-Disposition': 'attachment; filename="calendar.ics"',
      });

      response.end(calendar.toString());
    })
    .listen(3000, '127.0.0.1', () => {
      console.log('Server running at http://127.0.0.1:3000/');
    });
}

// startServer(
//   getCalendar([
//     {
//       checkin: new CustomDate('2026-04-17T11:00:30.778+02:00[Europe/Paris]'),
//       checkout: new CustomDate('2026-04-17T11:00:30.778+02:00[Europe/Paris]'),
//     },
//   ]),
// );
