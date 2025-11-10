import { getAttendanceLiveNumber } from '../scripts/get-attendance-live-number.js';
import { updateAttendanceFile } from '../scripts/write-data.js';

try {
  const attendance = await getAttendanceLiveNumber();

  console.log(`Got 1 new data row`);

  await updateAttendanceFile(attendance);

  console.log('Saved 1 new data row');
} catch (error) {
  console.error(`Could not get attendance ${error}`);
}
