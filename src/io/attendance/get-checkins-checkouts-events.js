import { Temporal } from 'temporal-polyfill';

export function getCheckinsCheckoutsEvents(rawEvents) {
  const events = [];
  for (const rawEvent of rawEvents) {
    events.push(getEvent(rawEvent.checkin, 'CHECKED_IN'));
    events.push(getEvent(rawEvent.checkout, 'CHECKED_OUT'));
  }

  return events.sort((eventA, eventB) =>
    Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
  );
}

function getEvent(date, type) {
  if (type === 'CHECKED_IN') {
    return {
      date,
      arrived: 1,
      left: 0,
    };
  } else if (type === 'CHECKED_OUT') {
    return {
      date,
      arrived: 0,
      left: 1,
    };
  }
}
