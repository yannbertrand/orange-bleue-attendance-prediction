import { writeFile } from 'node:fs/promises';
import {
  readAttendanceFile,
  readPredictionFile,
} from '../src/io/read-attendance-events-file.js';

const attendanceData = await readAttendanceFile();

const attendanceResult = [
  `date,visitors,arrived,leftOfTimeout,leftBeforeTimeout,courseParticipants,courseName,courseStatus`,
];

for (const {
  date,
  visitors,
  arrived,
  leftOfTimeout,
  leftBeforeTimeout,
  courseParticipants,
  courseName,
  courseStatus,
} of attendanceData) {
  let participantsNb = courseParticipants;
  if (Number.isNaN(courseParticipants)) {
    participantsNb = '';
  }

  const newAttendanceCsvFormattedData = `${date},${visitors},${arrived},${leftOfTimeout},${leftBeforeTimeout},${participantsNb},${courseName},${courseStatus}`;

  attendanceResult.push(newAttendanceCsvFormattedData);
}

attendanceResult.push('');
const attendanceResultAsString = attendanceResult.join('\n');

await writeFile('./data/attendance.csv', attendanceResultAsString, 'utf8');

const predictionData = await readPredictionFile();

const predictionResult = [
  `date,visitors,courseParticipants,courseName,courseStatus`,
];

for (const {
  date,
  visitors,
  courseParticipants,
  courseName,
  courseStatus,
} of predictionData) {
  let participantsNb = courseParticipants;
  if (Number.isNaN(courseParticipants)) {
    participantsNb = '';
  }

  const newAttendanceCsvFormattedData = `${date},${visitors},${participantsNb},${courseName},${courseStatus}`;

  predictionResult.push(newAttendanceCsvFormattedData);
}

predictionResult.push('');
const predictionResultAsString = predictionResult.join('\n');

await writeFile('./data/prediction.csv', predictionResultAsString, 'utf8');
