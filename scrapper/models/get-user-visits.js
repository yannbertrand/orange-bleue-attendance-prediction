import { CustomDate } from '../../src/utils/date.js';

export function getUserVisits(historyReport) {
  const visits = [];
  for (const visit of historyReport) {
    const checkin = new CustomDate(visit.checkinTime);
    const checkout = new CustomDate(visit.checkoutTime);
    visits.push({ checkin, checkout });
  }
  return visits;
}
