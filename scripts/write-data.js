import { appendFile } from 'node:fs/promises';

export const updateAttendanceFile = async ({ date, liveVisitors }) => {
  const newAttendanceCsvFormattedData = `${date},${liveVisitors},,,\n`;

  await appendFile(
    './data/attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};
