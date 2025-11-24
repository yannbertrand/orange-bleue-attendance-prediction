import { writeFile } from 'node:fs/promises';
import { estimateEvolution } from './calculate.js';
import { readAttendanceFile } from './read-data.js';

const data = await readAttendanceFile();
const evolution = estimateEvolution(data);

const result = [
  `date,visitors,arrived,leftOfTimeout,leftBeforeTimeout,courseParticipants,courseName,courseStatus`,
];

for (const i of Object.keys(data)) {
  let {
    date,
    visitors,
    arrived,
    leftOfTimeout,
    leftBeforeTimeout,
    courseParticipants,
    courseName,
    courseStatus,
  } = { ...data[i], ...evolution[i] };
  if (Number.isNaN(courseParticipants)) {
    courseParticipants = '';
  }

  const newAttendanceCsvFormattedData = `${date.toString()},${visitors},${arrived},${leftOfTimeout},${leftBeforeTimeout},${courseParticipants},${courseName},${courseStatus}`;

  result.push(newAttendanceCsvFormattedData);
}

result.push('');
const resultAsString = result.join('\n');

await writeFile('./data/attendance.csv', resultAsString, 'utf8');
