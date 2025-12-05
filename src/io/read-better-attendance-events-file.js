import { readFile } from 'node:fs/promises';
import { CustomDate } from '../utils/date.js';

export const readBetterAttendanceFile = async () => {
  const betterAttendanceFileContent = await readFile(
    './data/better-attendance.csv',
    'utf8'
  );

  return getBetterEventsFromCsv(betterAttendanceFileContent);
};

export function getBetterEventsFromCsv(csvData) {
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
      date: new CustomDate(attendanceLine[0]),
      visitors: Number.parseInt(attendanceLine[1], 10),
      arrived: Number.parseInt(attendanceLine[2], 10),
      left: Number.parseInt(attendanceLine[3], 10),
    };
    result.push(line);
  }

  return result;
}
