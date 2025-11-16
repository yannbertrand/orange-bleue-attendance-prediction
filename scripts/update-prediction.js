import { readFile, writeFile } from 'node:fs/promises';

export const updatePredictionFile = async (courses) => {
  let fileContent = await readFile('./data/prediction.csv', 'utf8');

  let nbOfNewRows = 0;
  let nbOfUpdatedRows = 0;
  for (const course of courses) {
    const courseStartDateString = course.startDateTime.toISOString();
    const courseEndDateString = course.endDateTime.toISOString();
    const courseLineRegex = new RegExp(
      `(${courseStartDateString}),(\\d*),(\\d*),${course.name},(.+?)\n`
    );
    if (courseLineRegex.test(fileContent)) {
      // Update lines
      const beforeFileContent = fileContent;
      fileContent = fileContent.replace(
        courseLineRegex,
        `${courseStartDateString},${course.bookedParticipants},${course.bookedParticipants},${course.name},${course.appointmentStatus}\n`
      );

      if (fileContent !== beforeFileContent) {
        nbOfUpdatedRows++;
      }
    } else {
      // Create lines
      const lineContentStart = `${courseStartDateString},${course.bookedParticipants},${course.bookedParticipants},${course.name},${course.appointmentStatus}\n`;
      fileContent += lineContentStart;
      const lineContentEnd = `${courseEndDateString},0,0,${course.name},FINISHED\n`;
      fileContent += lineContentEnd;
      nbOfNewRows++;
    }
  }

  await writeFile('./data/prediction.csv', fileContent, 'utf8');

  return { nbOfUpdatedRows, nbOfNewRows };
};
