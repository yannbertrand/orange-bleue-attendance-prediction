import { readFile } from 'node:fs/promises';
import { stringToDate } from './models/date.js';

export const readAttendanceFile = async () => {
  const attendanceFileContent = await readFile('./data/attendance.csv', 'utf8');

  return getEventsFromCsv(attendanceFileContent);
};

export function getEventsFromCsv(csvData) {
  const attendanceLines = csvData.split('\n');
  if (attendanceLines[0].startsWith('date')) {
    attendanceLines.splice(0, 1);
  }
  if (attendanceLines.at(-1) === '') {
    attendanceLines.splice(-1, 1);
  }

  const result = [];
  for (let index = 0; index < attendanceLines.length; index++) {
    const attendanceLine = attendanceLines[index].split(',');
    const line = {
      date: stringToDate(attendanceLine[0]),
      visitors: Number.parseInt(attendanceLine[1], 10),
      arrived: attendanceLine[2] ? Number.parseInt(attendanceLine[2], 10) : 0,
      leftOfTimeout: attendanceLine[3]
        ? Number.parseInt(attendanceLine[3], 10)
        : 0,
      leftBeforeTimeout: attendanceLine[4]
        ? Number.parseInt(attendanceLine[4], 10)
        : 0,
      courseParticipants: Number.parseInt(attendanceLine[5], 10),
      courseName: attendanceLine[6],
      courseStatus: attendanceLine[7],
    };
    result.push(line);
  }

  return result;
}

export const groupPerDay = (attendanceData) => {
  return attendanceData.reduce((result, value) => {
    const dayAsString = value.date.toZonedDateISO().toString();
    if (result[dayAsString] === undefined) {
      result[dayAsString] = [];
    }
    result[dayAsString].push(value);
    return result;
  }, {});
};
