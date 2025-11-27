import { readFile, writeFile } from 'node:fs/promises';
import { dateToString } from './models/date.js';

export const updatePredictionFile = async (courses) => {
  let fileContent = await readFile('./data/prediction.csv', 'utf8');

  let nbOfNewRows = 0;
  let nbOfUpdatedRows = 0;
  for (const course of courses) {
    const courseStartDateString = dateToString(course.startDateTime);
    const courseEndDateString = dateToString(course.endDateTime);
    const courseLineRegex = new RegExp(
      `(${courseStartDateString.replaceAll(
        /([+[\]])/g,
        '\\$1'
      )}),(\\d*),(\\d*),${course.courseName},(.+?)\n`
    );
    if (courseLineRegex.test(fileContent)) {
      // Update lines
      const beforeFileContent = fileContent;
      fileContent = fileContent.replace(
        courseLineRegex,
        `${courseStartDateString},${course.courseParticipants},${course.courseParticipants},${course.courseName},${course.courseStatus}\n`
      );

      if (fileContent !== beforeFileContent) {
        nbOfUpdatedRows++;
      }
    } else {
      // Create lines
      const lineContentStart = `${courseStartDateString},${course.courseParticipants},${course.courseParticipants},${course.courseName},${course.courseStatus}\n`;
      fileContent += lineContentStart;
      const lineContentEnd = `${courseEndDateString},0,0,${course.courseName},FINISHED\n`;
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
