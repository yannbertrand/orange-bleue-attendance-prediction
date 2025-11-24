import { readFile } from 'node:fs/promises';
import { Temporal } from 'temporal-polyfill';

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
      date: Temporal.Instant.from(attendanceLine[0]),
      visitors: Number.parseInt(attendanceLine[1], 10),
      courseParticipants: Number.parseInt(attendanceLine[2], 10),
      courseName: attendanceLine[3],
      courseStatus: attendanceLine[4],
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
