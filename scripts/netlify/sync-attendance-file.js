import { Temporal } from 'temporal-polyfill';
import { getCoursesByDate } from '../../scrapper/get-courses.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getActiveCourse } from '../../src/io/attendance/get-active-course.js';
import { getLastSlowUpdateEvent } from '../../src/io/attendance/get-last-slow-update-event.js';
import { readAttendanceFile } from '../../src/io/read-attendance-events-file.js';
import { readBetterAttendanceFile } from '../../src/io/read-better-attendance-events-file.js';
import { getAllNetlifyEventsAfter } from '../../src/io/read-netlify-data.js';
import { updateAttendanceFile } from '../../src/io/update-attendance-file.js';
import { updateBetterAttendanceFile } from '../../src/io/update-better-attendance-file.js';
import { CustomDate, getNow } from '../../src/utils/date.js';

const lastManualUpdate = new CustomDate('2025-12-09T06:00:10.834+01:00');
console.log(`Last found update: ${lastManualUpdate?.print()}`);

const existingEvents = await readBetterAttendanceFile();
console.log(`Got ${existingEvents.length} events from attendance file`);

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

const upToDateData = [...existingEvents]
  .filter((event) =>
    event.date.isAfterOrEquals(morningOfLastManualUpdateEvent?.date)
  )
  .sort((eventA, eventB) =>
    Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
  );
console.log(JSON.stringify(upToDateData.at(0)));

const filteredDuplicates = new Map();
for (const e of upToDateData) {
  if (!filteredDuplicates.has(e.date)) {
    filteredDuplicates.set(e.date, e);
  }
}

const newData = Object.values(Object.fromEntries(filteredDuplicates));

const visits = [];
const customers = new Map();
for (const value of newData) {
  if (customers.has(value.customer)) {
    if (value.type === 'CHECKOUT') {
      const checkin = customers.get(value.customer);
      visits.push({
        ...value,
        duration: value.date.since(checkin),
        checkin,
        checkout: value.date,
      });
    }
    customers.delete(value.customer);
  } else {
    customers.set(value.customer, value.date);
  }
}

const reviewedTimeoutDuration = [];
for (const visit of visits) {
  reviewedTimeoutDuration.push({
    date: visit.checkin,
    type: 'CHECKIN',
    isRealDate: true,
    customer: visit.customer,
    reason: '',
  });
  if (
    Temporal.Duration.compare(
      visit.duration,
      Temporal.Duration.from({ hours: 2 })
    ) === 0
  ) {
    if (visit.reason === 'DOUBLE_SCAN') {
      reviewedTimeoutDuration.push({
        date: visit.checkin.add({ hours: 1 }),
        customer: visit.customer,
        type: 'CHECKOUT',
        isRealDate: false,
        reason: 'DOUBLE_SCAN',
      });
    } else {
      reviewedTimeoutDuration.push({
        date: visit.checkin.add({ hours: 1 }),
        customer: visit.customer,
        type: 'CHECKOUT',
        isRealDate: false,
        reason: 'VISIT_TIMEOUT',
      });
    }
  } else {
    reviewedTimeoutDuration.push({
      date: visit.checkout,
      customer: visit.customer,
      type: 'CHECKOUT',
      isRealDate: true,
      reason: '',
    });
  }
}

const reviewedTimeoutDurationSorted = reviewedTimeoutDuration.sort(
  (eventA, eventB) => Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
);

console.log(
  `Calculating evolution from ${morningOfLastManualUpdateEvent?.date.print()} to ${reviewedTimeoutDurationSorted
    .at(-1)
    .date.print()}`
);
console.log(JSON.stringify(reviewedTimeoutDurationSorted.at(0)));

const dataWithEvolution = simpleEstimateEvolution(
  reviewedTimeoutDurationSorted
);

function simpleEstimateEvolution(data) {
  let count = 0;
  const result = [];
  for (const event of data) {
    if (event.type === 'CHECKIN') {
      count++;
      result.push({ ...event, visitors: count, arrived: 1, left: 0 });
    } else if (event.type === 'CHECKOUT') {
      count--;
      result.push({ ...event, visitors: count, arrived: 0, left: 1 });
    } else {
      throw new Error('unknown type ' + event.type);
    }
  }
  return result;
}

console.log(`${dataWithEvolution.length} events found today`);

const { nbOfNewRows, nbOfUpdatedRows } = await updateBetterAttendanceFile(
  morningOfLastManualUpdateEvent.date,
  dataWithEvolution
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
