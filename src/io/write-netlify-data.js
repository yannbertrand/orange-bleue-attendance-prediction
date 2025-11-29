import { store } from './read-netlify-data.js';

export async function setNetlifyEvent(event) {
  const dateString = event.date.toString();
  const baseEvent = {
    ...event,
    date: dateString,
  };

  if (event.courseParticipants !== undefined) {
    return await store.setJSON(dateString, {
      ...baseEvent,
      startDateTime: event.startDateTime.toString(),
      endDateTime: event.endDateTime.toString(),
    });
  } else {
    return await store.setJSON(dateString, baseEvent);
  }
}
