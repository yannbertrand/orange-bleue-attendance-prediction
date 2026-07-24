import { readFile, writeFile } from 'node:fs/promises';

export const updateCalendarFile = async (calendar) => {
  const fileContent = await readFile('./data/calendar.ics', 'utf8');

  const nbOfNewRows =
    calendar.toString().split('\n').length - fileContent.split('\n').length;

  await writeFile('./data/calendar.ics', calendar.toString(), 'utf8');

  return { nbOfUpdatedRows: 0, nbOfNewRows };
};
