import { Temporal } from 'temporal-polyfill';
import { getCoursesByDate } from '../../scrapper/get-courses.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getActiveCourse } from '../../src/io/attendance/get-active-course.js';
import { getLastSlowUpdateEvent } from '../../src/io/attendance/get-last-slow-update-event.js';
import { readAttendanceFile } from '../../src/io/read-attendance-events-file.js';
import { getAllNetlifyEventsAfter } from '../../src/io/read-netlify-data.js';
import { updateAttendanceFile } from '../../src/io/update-attendance-file.js';
import { CustomDate, getNow } from '../../src/utils/date.js';

const lastManualUpdate = await getLastSlowUpdateEvent();
console.log(`Last found update: ${lastManualUpdate?.print()}`);

const existingEvents = await readAttendanceFile();
console.log(`Got ${existingEvents.length} events from attendance file`);

const newNetlifyData = await getAllNetlifyEventsAfter(lastManualUpdate);
console.log(`Found ${newNetlifyData.length} new events from Netlify`);

const firstDayNeededForEstimationCalculation =
  lastManualUpdate.hour <= 1
    ? lastManualUpdate.subtract({ days: 1 })
    : lastManualUpdate;
const startOfDay = firstDayNeededForEstimationCalculation.with({
  hour: 6,
  minute: 0,
});
const morningOfLastManualUpdateEvent = existingEvents.find(
  (event) => event.date.since(startOfDay).sign >= 0
);

console.log(`Filtering and sorting events`);

const upToDateData = [...existingEvents, ...newNetlifyData]
  .filter((event) =>
    event.date.isAfterOrEquals(morningOfLastManualUpdateEvent?.date)
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

console.log('Finding courses and participants');

const courses = (await getCoursesByDate(lastManualUpdate, getNow())).map(
  (course) => {
    const foundEvent = existingEvents.find((event) =>
      event.date.isBetween(course.startDateTime, course.endDateTime)
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
  }
);

console.log(
  `Calculating evolution from ${morningOfLastManualUpdateEvent?.date.print()} to ${newData
    .at(-1)
    .date.print()}`
);

const dataWithEvolution = estimateEvolution(
  newData,
  morningOfLastManualUpdateEvent
);

const completeData = dataWithEvolution.map((event) => {
  const liveCourse = getActiveCourse(courses, event.date);
  return { ...event, ...liveCourse };
});

console.log(`${completeData.length} events found today`);

const { nbOfNewRows, nbOfUpdatedRows } = await updateAttendanceFile(
  morningOfLastManualUpdateEvent.date,
  completeData
);

console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
);

export function getAttendanceEvent({ date, visitors } = {}) {
  return {
    date: date ? new CustomDate(date) : getNow(),
    visitors: visitors ?? 0,
  };
}
