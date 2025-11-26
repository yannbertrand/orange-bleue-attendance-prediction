import { appendFile } from 'node:fs/promises';

export const updateAttendanceFile = async (event) => {
  const newAttendanceCsvFormattedData = getAttendanceEventAsCsv(event);

  await appendFile(
    './data/attendance.csv',
    `${newAttendanceCsvFormattedData}\n`,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};

export function getAttendanceEventAsCsv({
  date,
  visitors,
  arrived,
  leftOfTimeout,
  leftBeforeTimeout,
  courseParticipants,
  courseName,
  courseStatus,
}) {
  return `${date.toString()},${visitors},${arrived},${leftOfTimeout},${leftBeforeTimeout},${courseParticipants},${courseName},${courseStatus}`;
}
