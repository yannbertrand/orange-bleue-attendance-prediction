import { appendFile } from 'node:fs/promises';
import { dateToString } from './utils/date.js';

export const addEventToAttendanceFile = async (event) => {
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
  return `${dateToString(
    date
  )},${visitors},${arrived},${leftOfTimeout},${leftBeforeTimeout},${
    courseParticipants ?? ''
  },${courseName ?? ''},${courseStatus ?? ''}`;
}
