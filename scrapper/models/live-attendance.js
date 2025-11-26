import { Temporal } from 'temporal-polyfill';

export function getLiveAttendance(dateString, visitors) {
  if (Number.isNaN(Date.parse(dateString))) {
    throw new Error(`AttendanceLive invalid date: "${dateString}"`);
  }
  if (!Number.isInteger(visitors)) {
    throw new Error(`AttendanceLive invalid visitors: "${visitors}"`);
  }

  const date = Temporal.Instant.from(
    new Date(dateString).toISOString()
  ).toZonedDateTimeISO('Europe/Paris');

  return { date, visitors };
}
