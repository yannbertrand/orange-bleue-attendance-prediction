import { readFile } from 'node:fs/promises';
import { CustomDate } from '../utils/date.js';

export const readRawAttendanceFile = async () => {
  const rawAttendanceFileContent = await readFile(
    './data/raw-attendance.csv',
    'utf8'
  );

  return getRawEventsFromCsv(rawAttendanceFileContent);
};

export function getRawEventsFromCsv(csvData) {
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
      customer: attendanceLine[2],
    };
    result.push(line);
  }

  return result;
}
