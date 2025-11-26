import { readFile, writeFile } from 'node:fs/promises';
import { getAttendanceEventAsCsv } from './add-event-to-attendance-file.js';

export const updateAttendanceFile = async (lastKnownEvent, newEvents) => {
  const baseAttendanceFileContent = await readFile(
    './data/attendance.csv',
    'utf8'
  );
  const baseAttendanceFileContentAsArray =
    baseAttendanceFileContent.split('\n');
  const indexToRemove = baseAttendanceFileContentAsArray.findIndex((event) =>
    event.startsWith(lastKnownEvent)
  );

  const newAttendanceFileContentAsArray =
    baseAttendanceFileContentAsArray.toSpliced(indexToRemove + 1);

  for (const event of newEvents) {
    newAttendanceFileContentAsArray.push(getAttendanceEventAsCsv(event));
  }
  newAttendanceFileContentAsArray.push('');

  const newAttendanceCsvFormattedData =
    newAttendanceFileContentAsArray.join('\n');
  await writeFile(
    './data/attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  return newAttendanceCsvFormattedData;
};
