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
    const chunkKeys = keys.slice(i, i + rateLimitChunkSize);
    console.debug(`Getting next ${chunkKeys.length} blobs`);
    events.push(
      ...(await Promise.all(
        chunkKeys.map((key) => store.get(key, { type: 'json' }))
      ))
    );
    console.debug(`Got ${chunkKeys.length} blobs`);
    const currentChunkNb = Math.ceil(i / rateLimitChunkSize) + 1;
    if (currentChunkNb < nbOfChunks) {
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

function getAttendance({ date, visitors }) {
  return {
    date: stringToDate(date),
    visitors: visitors,
  };
}
