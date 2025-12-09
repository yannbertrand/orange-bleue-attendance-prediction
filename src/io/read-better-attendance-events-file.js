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
  const attendanceLines = csvData.split('\n').filter((l) => l !== '');
  if (attendanceLines[0].startsWith('date')) {
    attendanceLines.splice(0, 1);
  }

  const result = [];
  for (let index = 0; index < attendanceLines.length; index++) {
    const attendanceLine = attendanceLines[index].split(',');
    const line = {
      date: new CustomDate(attendanceLine[0]),
      type: attendanceLine[1],
      visitors: Number.parseInt(attendanceLine[2], 10),
      arrived: Number.parseInt(attendanceLine[3], 10),
      left: Number.parseInt(attendanceLine[4], 10),
      customer: attendanceLine[5],
      isRealDate: attendanceLine[6],
      reason: attendanceLine[7],
    };
    result.push(line);
  }

  return result;
}
