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

export function getAttendanceEventAsCsv({
  date,
  type,
  visitors,
  arrived,
  left,
  isRealDate,
  reason,
}) {
  return `${date},${type},${visitors},${arrived},${left},${isRealDate},${reason}`;
}
