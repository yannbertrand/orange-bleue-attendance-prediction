import { readFile, writeFile } from 'node:fs/promises';

export const updatePredictionFile = async (courses) => {
  let fileContent = await readFile('./data/prediction.csv', 'utf8');

  let nbOfNewRows = 0;
  let nbOfUpdatedRows = 0;
  for (const course of courses) {
    const courseStartDateString = course.startDateTime.toISOString();
    if (fileContent.includes(courseStartDateString)) {
      // Update lines
      const courseLineRegex = new RegExp(
        `(${courseStartDateString}),(\\d*),(\\d*),(.+?),(.+?)\n`
      );
      if (courseLineRegex.test(fileContent)) {
        const beforeFileContent = fileContent;
        fileContent = fileContent.replace(
          courseLineRegex,
          `${courseStartDateString},${course.bookedParticipants},${course.bookedParticipants},${course.name},${course.appointmentStatus}\n`
        );

        if (fileContent !== beforeFileContent) {
          nbOfUpdatedRows++;
        }
      }
    } else {
      // Create lines
      const lineContent = `${courseStartDateString},${course.bookedParticipants},${course.bookedParticipants},${course.name},${course.appointmentStatus}\n`;
      fileContent += lineContent;
      nbOfNewRows++;
    }
  }

  await writeFile('./data/prediction.csv', fileContent, 'utf8');

  return { nbOfUpdatedRows, nbOfNewRows };
};
