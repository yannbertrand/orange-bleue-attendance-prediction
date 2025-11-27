import { store } from './read-netlify-data.js';
import { dateToString } from './utils/date.js';

export async function setNetlifyEvent(event) {
  const dateString = dateToString(event.date);
  await store.setJSON(dateString.toString(), {
    ...event,
    date: dateString,
  });
}
