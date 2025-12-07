import { Temporal } from 'temporal-polyfill';

export function getCheckinsCheckoutsEvents(rawEvents) {
  const events = [];
  for (const rawEvent of rawEvents) {
    events.push(getEvent('CHECKED_IN', rawEvent));
    events.push(getEvent('CHECKED_OUT', rawEvent));
  }

  return events.sort((eventA, eventB) =>
    Temporal.ZonedDateTime.compare(eventA.date, eventB.date)
  );
}

function getEvent(type, rawEvent) {
  if (type === 'CHECKED_IN') {
    return {
      date: rawEvent.checkin,
      type: 'CHECKIN',
      arrived: 1,
      left: 0,
      isRealDate: true,
      reason: '',
    };
  } else if (type === 'CHECKED_OUT') {
    return {
      date: rawEvent.checkout,
      type: 'CHECKOUT',
      arrived: 0,
      left: 1,
      isRealDate: rawEvent.realCheckout,
      reason: rawEvent.reason,
    };
  }
}
