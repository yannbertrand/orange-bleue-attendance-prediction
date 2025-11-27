import { getStore } from '@netlify/blobs';
import { Temporal } from 'temporal-polyfill';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getLastSlowUpdateEvent } from '../../src/io/attendance/get-last-slow-update-event.js';
import {
  getZonedDateTime,
  readAttendanceFile,
} from '../../src/io/read-attendance-events-file.js';
import { updateAttendanceFile } from '../../src/io/update-attendance-file.js';
import { getNetlifyInfo } from '../utils/env.js';

const lastManualUpdate = await getLastSlowUpdateEvent();
console.log(`Last found update: ${lastManualUpdate.toString()}`);

export async function getNetlifyBlobsData(storeName, after) {
  const { siteID, token, rateLimitChunkSize, rateLimitTimeout } =
    getNetlifyInfo();
  const store = await getStore({ name: storeName, siteID, token });
  const { blobs } = await store.list();
  console.log(`Found ${blobs.length} blobs`);

  const keys = [];
  for (const blob of blobs) {
    const key = blob.key.endsWith('Paris]')
      ? blob.key.replace(' ', '+')
      : blob.key;
    const blobDate = getZonedDateTime(key);
    if (Temporal.ZonedDateTime.compare(blobDate, after) > 0) {
      keys.push(key);
    }
  }
  console.log(`Filtered ${keys.length} blobs in time interval`);

  const events = [];
  const nbOfChunks = Math.ceil(keys.length / rateLimitChunkSize);
  console.log(`Sliced in ${nbOfChunks} chunks`);
  for (let i = 0; i < keys.length; i += rateLimitChunkSize) {
    const chunkKeys = keys.slice(i, i + rateLimitChunkSize);
    console.log(`Getting next ${chunkKeys.length} blobs`);
    events.push(
      ...(await Promise.all(
        chunkKeys.map((key) => store.get(key, { type: 'json' }))
      ))
    );
    console.log(`Got ${chunkKeys.length} blobs`);
    const currentChunkNb = Math.ceil(i / rateLimitChunkSize) + 1;
    if (currentChunkNb < nbOfChunks) {
      await new Promise((resolve) => setTimeout(resolve, rateLimitTimeout));
      console.log(`Rate limit done`);
    }
  }

  const result = events.filter((e) => e !== null).map(getAttendanceEvent);
  console.log(`Found ${result.length} new events from Netlify`);
  return result;
}

const existingEvents = await readAttendanceFile();
const newNetlifyData = await getNetlifyBlobsData(
  'attendance',
  lastManualUpdate
);

const morningOfLastManualUpdate = lastManualUpdate.with({ hour: 5, minute: 0 });
const upToDateData = [...existingEvents, ...newNetlifyData]
  .filter(
    (event) =>
      Temporal.ZonedDateTime.compare(event.date, morningOfLastManualUpdate) >= 0
  )
  .sort((eventA, eventB) =>
    Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
  );

const filteredDuplicates = new Map();
for (const e of upToDateData) {
  if (!filteredDuplicates.has(e.date)) {
    filteredDuplicates.set(e.date, e);
  }
}

const newData = Object.values(Object.fromEntries(filteredDuplicates));

const todayCourses = (await getTodayCourses()).map((course) => {
  const foundEvent = existingEvents.find(
    (event) =>
      Temporal.ZonedDateTime.compare(course.startDateTime, event.date) <= 0 &&
      Temporal.ZonedDateTime.compare(event.date, course.endDateTime) <= 0
  );
  if (!foundEvent) {
    return course;
  }

  return {
    ...course,
    courseParticipants:
      foundEvent.courseParticipants > course.courseParticipants
        ? foundEvent.courseParticipants
        : course.courseParticipants,
  };
});

const completeData = newData
  .map((event, i) => {
    const evolution = getEvolution(
      newData[i - 1] ? estimateEvolution([newData[i - 1], event]).at(-1) : event
    );
    return { ...event, ...evolution };
  })
  .filter(
    (event) => Temporal.ZonedDateTime.compare(event.date, lastManualUpdate) > 0
  )
  .map((event) => {
    const foundCourse = todayCourses.find((course) => {
      return (
        Temporal.ZonedDateTime.compare(course.startDateTime, event.date) <= 0 &&
        Temporal.ZonedDateTime.compare(event.date, course.endDateTime) <= 0
      );
    });
    const liveCourse = getCourse(foundCourse);
    return { ...event, ...liveCourse };
  });

console.log(`${completeData.length} events will be updated`);

await updateAttendanceFile(lastManualUpdate, completeData);

console.log(`File wrote successfully`);

export function getAttendanceEvent({ date, visitors } = {}) {
  return {
    date: date
      ? getZonedDateTime(date)
      : Temporal.Now.zonedDateTimeISO('Europe/Paris'),
    visitors: visitors ?? 0,
  };
}

function getEvolution({ arrived, leftOfTimeout, leftBeforeTimeout } = {}) {
  return {
    arrived: arrived ?? 0,
    leftOfTimeout: leftOfTimeout ?? 0,
    leftBeforeTimeout: leftBeforeTimeout ?? 0,
  };
}

function getCourse({ courseParticipants, courseName, courseStatus } = {}) {
  return {
    courseParticipants: courseParticipants ?? '',
    courseName: courseName ?? '',
    courseStatus: courseStatus ?? '',
  };
}
