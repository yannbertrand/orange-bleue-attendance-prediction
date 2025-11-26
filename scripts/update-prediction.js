import { readFile, writeFile } from 'node:fs/promises';

export const updatePredictionFile = async (courses) => {
  let fileContent = await readFile('./data/prediction.csv', 'utf8');

  let nbOfNewRows = 0;
  let nbOfUpdatedRows = 0;
  for (const course of courses) {
    const courseStartDateString = course.startDateTime.toPlainDateTime();
    const courseEndDateString = course.endDateTime.toPlainDateTime();
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

  // Remove conflicting courses
  const fileContentAsArray = fileContent.split('\n');
  for (const [index, currentLine] of fileContentAsArray.entries()) {
    const nextLine = fileContentAsArray[index + 1];
    if (nextLine === undefined) {
      break;
    }
    const currentLineFields = currentLine.split(',');
    const nextLineFields = nextLine.split(',');

    const currentLineDate = currentLineFields[0];
    const nextLineDate = nextLineFields[0];
    if (currentLineDate === nextLineDate) {
      const currentLineStatus = currentLineFields[4];

      if (currentLineStatus === 'FINISHED') {
        fileContent = fileContent.replace(
          new RegExp(
            `${currentLineFields[0]},${currentLineFields[1]},${currentLineFields[2]},${currentLineFields[3]},${currentLineFields[4]}\n`
          ),
          ''
        );
      }
    }
  }

  await writeFile('./data/prediction.csv', fileContent, 'utf8');

  return { nbOfUpdatedRows, nbOfNewRows };
};
