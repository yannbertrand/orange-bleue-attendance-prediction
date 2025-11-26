import { getFutureCourses } from '../scrapper/get-future-courses.js';
import { updatePredictionFile } from '../src/io/update-prediction-file.js';

const futureCourses = await getFutureCourses();

console.log(`Found ${futureCourses.length} courses`);

const { nbOfUpdatedRows, nbOfNewRows } = await updatePredictionFile(
  futureCourses
);

console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
);
