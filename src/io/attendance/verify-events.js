import { Temporal } from 'temporal-polyfill';
import { officialEstimatedVisitDuration } from '../../../scrapper/models/customer.js';

export function verifyEvents(events) {
  const eventsPerDay = groupPerDay(events);
  for (const dayEvents of Object.values(eventsPerDay)) {
    const eventsPerDayAndCustomer = groupByCustomer(dayEvents);
    for (const customerDayEvents of Object.values(eventsPerDayAndCustomer)) {
      if (customerDayEvents.length % 2 !== 0) {
        throw new Error(
          `Customer day events count is odd: ${JSON.stringify(
            customerDayEvents
          )}`
        );
      }

      let lastEventType;
      for (const event of customerDayEvents) {
        if (event.type === lastEventType) {
          throw new Error(`Duplicate event types: ${JSON.stringify(event)}`);
        }
        lastEventType = event.type;
      }

      const checkins = customerDayEvents.filter(
        (event) => event.type === 'CHECKIN'
      );
      for (let i = 0; i < checkins.length - 1; i++) {
        if (
          Temporal.Duration.compare(
            checkins[i + 1].date.since(checkins[i].date),
            officialEstimatedVisitDuration
          ) < 0
        ) {
          throw new Error(
            `Too much checkins in less than official estimated visit duration: ${JSON.stringify(
              checkins
            )}`
          );
        }
      }
    }
  }
}

function groupByCustomer(events) {
  return events.reduce((result, event) => {
    if (result[event.customer] === undefined) {
      result[event.customer] = [];
    }
    result[event.customer].push(event);
    return result;
  }, {});
}

function groupPerDay(events) {
  return events.reduce((result, event) => {
    const dayAsString = getDateString(event.date);
    if (result[dayAsString] === undefined) {
      result[dayAsString] = [];
    }
    result[dayAsString].push(event);
    return result;
  }, {});
}

function getDateString(customDate) {
  if (customDate.hour <= 1) {
    return customDate.subtract({ days: 1 }).toPlainDate().toString();
  }
  return customDate.toPlainDate().toString();
}
