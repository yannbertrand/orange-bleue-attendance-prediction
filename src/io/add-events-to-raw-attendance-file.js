import { appendFile } from 'node:fs/promises';

export const addEventsToRawAttendanceFile = async (events) => {
  const newAttendanceCsvFormattedData = events.map((event) =>
    getAttendanceEventAsCsv(event)
  );

  await appendFile(
    './data/raw-attendance.csv',
    `${newAttendanceCsvFormattedData.join('\n')}\n`,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};

export function getAttendanceEventAsCsv({ date, type, customer }) {
  return `${date},${type},${customer}`;
}
