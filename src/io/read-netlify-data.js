import { getStore } from '@netlify/blobs';
import { Temporal } from 'temporal-polyfill';
import { getNetlifyInfo } from '../../scripts/utils/env.js';
import { CustomDate } from '../utils/date.js';

const netlifyInfo = getNetlifyInfo();
export const store = getStore({ name: 'attendance', ...netlifyInfo });

export async function getAllNetlifyEventsAfter(after) {
  let currentDate = (
    after.hour <= 1 ? after.subtract({ days: 1 }) : after
  ).toPlainDate();
  const keys = [currentDate.toString()];
  const today = Temporal.Now.plainDateISO();
  while (!currentDate.equals(today)) {
    currentDate = currentDate.add({ days: 1 });
    keys.push(currentDate.toString());
  }
  console.debug(
    `Filtered ${
      keys.length
    } blobs in time interval, from ${keys[0].toString()} to ${keys
      .at(-1)
      .toString()}`
  );

  const events = await Promise.all(
    keys.map((key) => store.get(key, { type: 'json' }))
  );

  return events
    .filter((e) => e !== null)
    .flat()
    .map(getAttendance)
    .filter((e) => e.date.isAfter(after));
}

export async function getNetlifyLastEvent() {
  const { blobs } = await store.list();
  const foundPastAttendanceBlob = blobs.at(-1);
  let pastAttendance;
  if (foundPastAttendanceBlob) {
    pastAttendance = await store.get(foundPastAttendanceBlob.key, {
      type: 'json',
    });
  }
  return getAttendance(pastAttendance);
}

function getAttendance(event) {
  const baseEvent = {
    ...event,
    date: new CustomDate(event.date),
  };

  if (event.courseParticipants !== undefined) {
    return {
      ...baseEvent,
      startDateTime: new CustomDate(event.startDateTime),
      endDateTime: new CustomDate(event.endDateTime),
    };
  }

  return {
    ...baseEvent,
  };
}
