import { Temporal } from 'temporal-polyfill';

export function toEvents(customerVisits) {
  const events = [];
  for (const customerVisit of customerVisits) {
    events.push(getEvent('CHECKED_IN', customerVisit));
    events.push(getEvent('CHECKED_OUT', customerVisit));
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
      customer: rawEvent.customer,
      isRealDate: true,
      reason: '',
    };
  } else if (type === 'CHECKED_OUT') {
    return {
      date: rawEvent.checkout,
      type: 'CHECKOUT',
      arrived: 0,
      left: 1,
      customer: rawEvent.customer,
      isRealDate: rawEvent.realCheckout,
      reason: rawEvent.reason,
    };
  }
}
