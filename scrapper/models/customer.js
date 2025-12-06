import { Temporal } from 'temporal-polyfill';
import { CustomDate } from '../../src/utils/date.js';

export function getCustomer({ customerNumber, checkinTime, checkoutTime }) {
  if (!customerNumber.startsWith('FF0')) {
    throw new Error(`Customer invalid number: "${customerNumber}"`);
  }

  const checkin = new CustomDate(checkinTime);
  if (checkoutTime) {
    const checkout = new CustomDate(checkoutTime);
    if (
      Temporal.Duration.compare(
        checkin.until(checkout),
        Temporal.Duration.from({ seconds: 10 })
      ) > 0
    ) {
      return {
        id: customerNumber,
        checkin,
        checkout,
      };
    }
  }

  const estimatedCheckout = checkin.add({ hours: 2 });
  return { id: customerNumber, checkin, checkout: estimatedCheckout };
}
