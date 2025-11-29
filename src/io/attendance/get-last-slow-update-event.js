import { Temporal } from 'temporal-polyfill';
import { readAttendanceFile } from '../read-attendance-events-file.js';

export async function getLastSlowUpdateEvent() {
  const events = await readAttendanceFile();

  let lastSlowUpdate;
  let nextEventDate;
  let currentCount = 0;
  for (const event of events.toReversed()) {
    if (!nextEventDate) {
      nextEventDate = event.date;
      lastSlowUpdate = event.date;
      continue;
    }
    if (event.date.isAfter(nextEventDate)) {
      throw new Error(
        `event.date (${event.date}) is after nextEventDate (${nextEventDate})`
      );
    }

    if (
      Temporal.Duration.compare(
        event.date.until(nextEventDate),
        Temporal.Duration.from({ minutes: 3 })
      ) <= 0
    ) {
      currentCount++;
      nextEventDate = event.date;
      if (currentCount === 5) {
        return lastSlowUpdate;
      }
      continue;
    }

    currentCount = 0;
    nextEventDate = event.date;
    lastSlowUpdate = event.date;
  }

  return events.at(-1).date;
}
