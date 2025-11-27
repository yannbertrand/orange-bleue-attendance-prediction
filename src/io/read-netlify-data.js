import { getStore } from '@netlify/blobs';
import { Temporal } from 'temporal-polyfill';
import { getNetlifyInfo } from '../../scripts/utils/env.js';
import { stringToDate } from './utils/date.js';

const netlifyInfo = getNetlifyInfo();
export const store = getStore({ name: 'attendance', ...netlifyInfo });

export async function getAllNetlifyEventsAfter(after) {
  const { rateLimitChunkSize, rateLimitTimeout } = getNetlifyInfo();
  const { blobs } = await store.list();
  console.debug(`Found ${blobs.length} blobs`);

  const keys = [];
  for (const blob of blobs) {
    const key = blob.key.endsWith('Paris]')
      ? blob.key.replace(' ', '+')
      : blob.key;
    const blobDate = stringToDate(key);
    if (Temporal.ZonedDateTime.compare(blobDate, after) > 0) {
      keys.push(key);
    }
  }
  console.debug(`Filtered ${keys.length} blobs in time interval`);

  const events = [];
  const nbOfChunks = Math.ceil(keys.length / rateLimitChunkSize);
  console.debug(`Sliced in ${nbOfChunks} chunks`);
  for (let i = 0; i < keys.length; i += rateLimitChunkSize) {
    const currentChunkNb = Math.ceil(i / rateLimitChunkSize) + 1;
    const chunkKeys = keys.slice(i, i + rateLimitChunkSize);
    console.debug(
      `Getting next ${chunkKeys.length} blobs (${currentChunkNb}/${nbOfChunks})`
    );
    events.push(
      ...(await Promise.all(
        chunkKeys.map((key) => store.get(key, { type: 'json' }))
      ))
    );
    console.debug(`Got ${chunkKeys.length} blobs`);
    if (currentChunkNb < nbOfChunks) {
      console.debug(`Pause for 1 min to avoid rate limiting...`);
      await new Promise((resolve) => setTimeout(resolve, rateLimitTimeout));
      console.debug(`Rate limit done`);
    }
  }

  const result = events.filter((e) => e !== null).map(getAttendance);
  console.debug(`Found ${result.length} new events from Netlify`);
  return result;
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
    date: stringToDate(event.date),
  };

  if (event.courseParticipants !== undefined) {
    return {
      ...baseEvent,
      startDateTime: stringToDate(event.startDateTime),
      endDateTime: stringToDate(event.endDateTime),
    };
  }

  return {
    ...baseEvent,
  };
}
