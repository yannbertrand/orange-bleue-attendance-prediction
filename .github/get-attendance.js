import { setFailed, setOutput } from '@actions/core';
import { getAttendanceLiveNumber } from '../scripts/get-attendance-live-number.js';

try {
  const attendance = await getAttendanceLiveNumber();

  console.log(`Got 1 new data row`);

  setOutput('attendance', JSON.stringify(attendance));
} catch (error) {
  setFailed(`Could not get attendance ${error}`);
}
