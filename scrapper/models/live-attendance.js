import { CustomDate } from '../../src/utils/date.js';

export function getLiveAttendance(dateString, visitors) {
  if (!Number.isInteger(visitors)) {
    throw new Error(`AttendanceLive invalid visitors: "${visitors}"`);
  }

  const date = new CustomDate(dateString);
  return { date, visitors };
}
