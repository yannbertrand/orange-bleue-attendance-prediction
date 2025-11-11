import { getFutureCourses } from '../scripts/get-future-courses.js';
import { updatePredictionFile } from '../scripts/update-prediction.js';

try {
  const futureCourses = await getFutureCourses();

  console.log(`Found ${futureCourses.length} courses`);

  const { nbOfUpdatedRows, nbOfNewRows } = await updatePredictionFile(
    futureCourses
  );

  console.log(
    `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
  );
} catch (error) {
  console.error(`Could not get attendance ${error}`);
}
