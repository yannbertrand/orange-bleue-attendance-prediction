import { Temporal } from 'temporal-polyfill';
import { getCoursesByDate } from '../../scrapper/get-courses.js';
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

const startOfDay = lastManualUpdate?.with({ hour: 5, minute: 0 });
const morningOfLastManualUpdate = existingEvents.find(
  (event) => event.date.since(startOfDay).sign >= 0
)?.date;
console.log(
  `Calculating evolution from ${dateToString(morningOfLastManualUpdate)}`
);

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

const courses = (
  await getCoursesByDate(lastManualUpdate, Temporal.Now.zonedDateTimeISO())
).map((course) => {
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

const dataWithEvolution = estimateEvolution(newData);

const completeData = dataWithEvolution.map((event) => {
  const liveCourse = getActiveCourse(courses, event.date);
  return { ...event, ...liveCourse };
});

console.log(`${completeData.length} events found today`);

const { nbOfNewRows, nbOfUpdatedRows } = await updateAttendanceFile(
  morningOfLastManualUpdate,
  completeData
);

console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
);

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
