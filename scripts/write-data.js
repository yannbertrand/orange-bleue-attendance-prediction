import { appendFile } from 'node:fs/promises';

export const updateAttendanceFile = async ({
  date,
  visitors,
  courseParticipants,
  courseName,
  courseStatus,
}) => {
  const newAttendanceCsvFormattedData = `${date.toISOString()},${visitors},${courseParticipants},${courseName},${courseStatus}\n`;

  await appendFile(
    './data/attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};
