import {
  getLiveCheckins,
  getLiveCheckouts,
} from '../scrapper/get-live-checkins.js';
import { toEvents } from '../src/io/attendance/to-events.js';
import { readBetterAttendanceFile } from '../src/io/read-better-attendance-events-file.js';
import { updateBetterAttendanceFile } from '../src/io/update-better-attendance-file.js';
import { CustomDate, getNow } from '../src/utils/date.js';

const forcedCalculationDate = undefined;

const currentAttendance = await readBetterAttendanceFile();
const today = forcedCalculationDate ?? new CustomDate(getNow());
const firstDayNeededForEstimationCalculation =
  today.hour <= 1 ? today.subtract({ days: 1 }) : today;
const startOfDay = {
  date: firstDayNeededForEstimationCalculation.with({
    hour: 6,
    minute: 0,
  }),
  visitors: 0,
};
const firstAttendanceEventOfDay = {
  ...(currentAttendance.find((e) => e.date.isAfter(startOfDay.date)) ??
    startOfDay),
};

const checkins = await getLiveCheckins();
const checkouts = await getLiveCheckouts();

const events = toEvents([...checkins, ...checkouts]);
const newEvents = getNewEvents(firstAttendanceEventOfDay, events);

const { nbOfNewRows, nbOfUpdatedRows } = await updateBetterAttendanceFile(
  firstAttendanceEventOfDay.date,
  newEvents
);
console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
);

function getNewEvents(firstAttendanceEventOfDay, events) {
  const newEvents = [];
  let visitors = firstAttendanceEventOfDay.visitors;
  for (const event of events) {
    if (event.date.isBeforeOrEquals(firstAttendanceEventOfDay.date)) {
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
