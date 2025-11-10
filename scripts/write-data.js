import { appendFile } from 'node:fs/promises';

export const updateAttendanceFile = async ({
  date,
  liveVisitors,
  courseParticipants,
  courseName,
  courseStatus,
}) => {
  const newAttendanceCsvFormattedData = `${date.toISOString()},${liveVisitors},${courseParticipants},${courseName},${courseStatus}\n`;

  await appendFile(
    './data/attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};
