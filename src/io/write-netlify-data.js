import { store } from './read-netlify-data.js';
import { dateToString } from './utils/date.js';

export async function setNetlifyEvent(event) {
  await store.setJSON(event.date.toPlainDateTime().toString(), {
    ...event,
    date: dateToString(event.date),
  });
}
