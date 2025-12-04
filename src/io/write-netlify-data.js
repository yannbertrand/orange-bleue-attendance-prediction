import { store } from './read-netlify-data.js';

export async function setNetlifyEvent(event) {
  const eventDay =
    event.date.hour < 5 ? event.date.subtract({ day: 1 }) : event.date;
  const dayString = eventDay.toPlainDate().toString();
  const netlifyContent = await store.get(dayString, { type: 'json' });

  if (event.courseParticipants !== undefined) {
    return await store.setJSON(dayString, [
      ...(netlifyContent ?? []),
      {
        ...event,
        startDateTime: event.startDateTime.toString(),
        endDateTime: event.endDateTime.toString(),
      },
    ]);
  } else {
    return await store.setJSON(dayString, [...(netlifyContent ?? []), event]);
  }
}
