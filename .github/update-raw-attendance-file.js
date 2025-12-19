import { Temporal } from 'temporal-polyfill';
import {
  getLiveCheckins,
  getLiveCheckouts,
} from '../scrapper/get-live-checkins.js';
import { readRawAttendanceFile } from '../src/io/read-raw-attendance-events-file.js';
import { updateRawAttendanceFile } from '../src/io/update-raw-attendance-file.js';
import { CustomDate, getNow } from '../src/utils/date.js';

const forcedCalculationDate = undefined;

const currentAttendance = await readRawAttendanceFile();
const today = forcedCalculationDate ?? new CustomDate(getNow());
const firstDayNeededForEstimationCalculation =
  today.hour <= 1 ? today.subtract({ days: 1 }) : today;
const startOfDay = {
  date: firstDayNeededForEstimationCalculation.with({
    hour: 6,
    minute: 0,
  }),
};
const firstAttendanceEventOfDay = {
  ...(currentAttendance.find((e) => e.date.isAfter(startOfDay.date)) ??
    startOfDay),
};

const checkins = await getLiveCheckins();
const checkouts = await getLiveCheckouts();
const events = toEvents([...checkins, ...checkouts]).sort((eventA, eventB) =>
  Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
);
function toEvents(customerVisits) {
  const events = [];
  for (const customerVisit of customerVisits) {
    events.push({
      date: customerVisit.checkin,
      type: 'CHECKIN',
      customer: customerVisit.customer,
    });
    if (customerVisit.checkout) {
      events.push({
        date: customerVisit.checkout,
        type: 'CHECKOUT',
        customer: customerVisit.customer,
      });
    }
  }
  return events;
}

const newEvents = getNewEvents(firstAttendanceEventOfDay, events);

const { nbOfNewRows, nbOfUpdatedRows } = await updateRawAttendanceFile(
  firstAttendanceEventOfDay.date,
  newEvents
);
console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`
);

function getNewEvents(firstAttendanceEventOfDay, events) {
  const newEvents = [];
  for (const event of events) {
    if (event.date.isBeforeOrEquals(firstAttendanceEventOfDay.date)) {
      continue;
    }

    newEvents.push({ ...event });
  }

  return newEvents;
}
