import { readFile, writeFile } from 'node:fs/promises';
import { getAttendanceEventAsCsv } from './add-events-to-better-attendance-file.js';

export const updateBetterAttendanceFile = async (lastKnownEvent, newEvents) => {
  const baseAttendanceFileContent = await readFile(
    './data/better-attendance.csv',
    'utf8'
  );
  const baseAttendanceFileContentAsArray =
    baseAttendanceFileContent.split('\n');
  const indexToRemove = baseAttendanceFileContentAsArray.findIndex((event) =>
    event.startsWith(lastKnownEvent.toString())
  );

  const newAttendanceFileContentAsArray =
    baseAttendanceFileContentAsArray.toSpliced(
      indexToRemove > -1 ? indexToRemove + 1 : -1
    );

  let nbOfUpdatedRows = 0;
  for (const event of newEvents) {
    const eventAsCsv = getAttendanceEventAsCsv(event);
    newAttendanceFileContentAsArray.push(eventAsCsv);

    const existingEventCsv = baseAttendanceFileContentAsArray.find(
      (baseEventCsv) => baseEventCsv.startsWith(eventAsCsv.split(',')[0])
    );
    if (existingEventCsv && existingEventCsv !== eventAsCsv) {
      nbOfUpdatedRows++;
    }
  }
  newAttendanceFileContentAsArray.push('');

  const newAttendanceCsvFormattedData =
    newAttendanceFileContentAsArray.join('\n');
  await writeFile(
    './data/better-attendance.csv',
    newAttendanceCsvFormattedData,
    'utf8'
  );

  const nbOfNewRows =
    newAttendanceFileContentAsArray.length -
    baseAttendanceFileContentAsArray.length;

  return { nbOfNewRows, nbOfUpdatedRows };
};
