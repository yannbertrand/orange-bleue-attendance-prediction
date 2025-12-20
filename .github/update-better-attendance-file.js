import { Temporal } from 'temporal-polyfill';
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

const checkins = await getLiveCheckins(true);
const checkouts = await getLiveCheckouts(true);
const nightEvents = getNightEvents(
  firstDayNeededForEstimationCalculation,
  new CustomDate(getNow())
);
const events = [...nightEvents, ...toEvents([...checkins, ...checkouts])].sort(
  (eventA, eventB) => Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
);

const filteredDuplicates = new Map();
for (const e of events) {
  if (!filteredDuplicates.has(e.date)) {
    filteredDuplicates.set(e.date, e);
  }
}

const newEvents = getNewEvents(
  firstAttendanceEventOfDay,
  Object.values(Object.fromEntries(filteredDuplicates))
);

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

function getNightEvents(firstDay, today) {
  const nightEvents = [];

  let currentDay = firstDay;
  do {
    nightEvents.push(
      getNightEvent(
        currentDay
          .subtract({ days: 1 })
          .with({ hour: 23, minute: 59, second: 59, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 0, minute: 0, second: 0, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 1, minute: 0, second: 0, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 2, minute: 0, second: 0, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 3, minute: 0, second: 0, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 4, minute: 0, second: 0, microsecond: 0 })
      )
    );
    nightEvents.push(
      getNightEvent(
        currentDay.with({ hour: 5, minute: 0, second: 0, microsecond: 0 })
      )
    );

    currentDay = currentDay.add({ days: 1 });
  } while (Temporal.PlainDate.compare(currentDay, today) <= 0);

  return nightEvents;
}

function getNightEvent(date) {
  return {
    date: new CustomDate(date.toString()),
    type: 'BLANK',
    arrived: 0,
    left: 0,
    customer: '',
    isRealDate: false,
    reason: 'NIGHT_TIME',
  };
}
