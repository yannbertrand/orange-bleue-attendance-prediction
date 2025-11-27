import { store } from './read-netlify-data.js';
import { dateToString } from './utils/date.js';

export async function setNetlifyEvent(event) {
  const dateString = dateToString(event.date);
  const baseEvent = {
    ...event,
    date: dateString,
  };

  if (event.courseParticipants !== undefined) {
    return await store.setJSON(dateString, {
      ...baseEvent,
      startDateTime: dateToString(event.startDateTime),
      endDateTime: dateToString(event.endDateTime),
    });
  } else {
    return await store.setJSON(dateString, baseEvent);
  }
}
