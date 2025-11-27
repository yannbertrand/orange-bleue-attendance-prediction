import { store } from './read-netlify-data.js';

export async function setNetlifyEvent(event) {
  await store.setJSON(event.date.toPlainDateTime().toString(), event);
}
