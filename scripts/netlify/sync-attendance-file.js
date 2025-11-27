import { Temporal } from 'temporal-polyfill';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getActiveCourse } from '../../src/io/attendance/get-active-course.js';
import { getLastSlowUpdateEvent } from '../../src/io/attendance/get-last-slow-update-event.js';
import { readAttendanceFile } from '../../src/io/read-attendance-events-file.js';
import { getAllNetlifyEventsAfter } from '../../src/io/read-netlify-data.js';
import { updateAttendanceFile } from '../../src/io/update-attendance-file.js';
import { dateToString, stringToDate } from '../../src/io/utils/date.js';

const lastManualUpdate = await getLastSlowUpdateEvent();
console.log(`Last found update: ${dateToString(lastManualUpdate)}`);

const existingEvents = await readAttendanceFile();
console.log(`Got ${existingEvents.length} events from attendance file`);
const newNetlifyData = await getAllNetlifyEventsAfter(lastManualUpdate);
console.log(`Found ${newNetlifyData.length} new events from Netlify`);

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
    const liveCourse = getCourse(getActiveCourse(todayCourses, event.date));
    return { ...event, ...liveCourse };
  });

console.log(`${completeData.length} events will be updated`);

await updateAttendanceFile(lastManualUpdate, completeData);

console.log(`File wrote successfully`);

export function getAttendanceEvent({ date, visitors } = {}) {
  return {
    date: date
      ? stringToDate(date)
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
