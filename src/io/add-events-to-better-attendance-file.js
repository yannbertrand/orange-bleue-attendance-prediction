import { appendFile } from 'node:fs/promises';

export const addEventsToBetterAttendanceFile = async (events) => {
  const newAttendanceCsvFormattedData = events.map((event) =>
    getAttendanceEventAsCsv(event)
  );

  await appendFile(
    './data/better-attendance.csv',
    `${newAttendanceCsvFormattedData.join('\n')}\n`,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};

export function getAttendanceEventAsCsv({ date, visitors, arrived, left }) {
  return `${date},${visitors},${arrived ?? ''},${left ?? ''}`;
}
