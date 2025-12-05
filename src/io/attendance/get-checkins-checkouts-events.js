import { Temporal } from 'temporal-polyfill';
import { CustomDate } from '../../utils/date.js';

export function getCheckinsCheckoutsEvents(rawEvents) {
  const now = new CustomDate(Temporal.Now.zonedDateTimeISO());
  const events = [];
  for (const rawEvent of rawEvents) {
    events.push(getEvent(rawEvent.checkin, 'CHECKED_IN'));
    if (rawEvent.checkout) {
      if (
        Temporal.Duration.compare(
          rawEvent.checkin.until(rawEvent.checkout),
          Temporal.Duration.from({ seconds: 10 })
        ) > 0
      ) {
        if (rawEvent.checkout.isBeforeOrEquals(now)) {
          events.push(getEvent(rawEvent.checkout, 'CHECKED_OUT'));
        }
      } else {
        events.push(
          getEvent(rawEvent.checkin.add({ hours: 2 }), 'CHECKED_OUT')
        );
      }
    }
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
