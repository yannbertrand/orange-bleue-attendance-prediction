import {
  getLiveCheckins,
  getLiveCheckouts,
} from '../scrapper/get-live-checkins.js';
import { addEventsToBetterAttendanceFile } from '../src/io/add-events-to-better-attendance-file.js';
import { getCheckinsCheckoutsEvents } from '../src/io/attendance/get-checkins-checkouts-events.js';
import { readBetterAttendanceFile } from '../src/io/read-better-attendance-events-file.js';

const currentAttendance = await readBetterAttendanceFile();
const lastAttendanceEvent = currentAttendance.at(-1);

const checkins = await getLiveCheckins();
const checkouts = await getLiveCheckouts();

const events = getCheckinsCheckoutsEvents([...checkins, ...checkouts]);
const newEvents = getNewEvents(lastAttendanceEvent, events);

console.log(
  `Got ${newEvents.length} new data rows: ${JSON.stringify(newEvents)}`
);

if (newEvents.length > 0) {
  await addEventsToBetterAttendanceFile(newEvents);

  console.log(`Saved ${newEvents.length} new data row`);
}

function getNewEvents(lastAttendanceEvent, events) {
  const newEvents = [];
  let visitors = lastAttendanceEvent.visitors;
  for (const event of events) {
    if (event.date.isBeforeOrEquals(lastAttendanceEvent.date)) {
      continue;
    }

    if (event?.arrived === 1) {
      visitors++;
    }
    if (event?.left === 1) {
      visitors--;
    }
    newEvents.push({ ...event, visitors });
  }

  return newEvents;
}
