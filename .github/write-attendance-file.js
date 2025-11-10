import { updateAttendanceFile } from '../scripts/write-data.js';

const newData = JSON.parse(process.argv.at(2));

await updateAttendanceFile(newData);

console.log('Saved 1 new data row');
