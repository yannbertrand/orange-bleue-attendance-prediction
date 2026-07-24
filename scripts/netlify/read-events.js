import { Temporal } from 'temporal-polyfill';
import {
  getAllNetlifyEventsAfter,
  store,
} from '../../src/io/read-netlify-data.js';

const after = Temporal.ZonedDateTime.from(
  '2025-12-02T00:52:02+01:00[Europe/Paris]'
);

// const { blobs } = await store.list({ prefix: '2025-12-04' });
const events = await getAllNetlifyEventsAfter(after);
console.log(events.map((e) => ({ ...e, date: e.date.toString() })));
// const obj = await store.get('2025-12-04');
// console.log({ obj });
