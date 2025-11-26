import { appendFile } from 'node:fs/promises';

export const updateAttendanceFile = async ({
  date,
  visitors,
  arrived,
  leftOfTimeout,
  leftBeforeTimeout,
  courseParticipants,
  courseName,
  courseStatus,
}) => {
  const newAttendanceCsvFormattedData = `${date.toString()},${visitors},${arrived},${leftOfTimeout},${leftBeforeTimeout},${courseParticipants},${courseName},${courseStatus}\n`;

  await appendFile(
    './data/attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};
