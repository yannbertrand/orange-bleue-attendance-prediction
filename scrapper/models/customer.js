import { Temporal } from 'temporal-polyfill';
import { CustomDate } from '../../src/utils/date.js';

export function getCustomer({
  customerId,
  customerNumber,
  checkinTime,
  checkoutTime,
}) {
  if (!customerNumber.startsWith('FF0')) {
    throw new Error(`Customer invalid number: "${customerNumber}"`);
  }

  const checkin = new CustomDate(checkinTime);
  const estimatedCheckout = checkin.add({ hours: 2 });
  if (checkoutTime) {
    const checkout = new CustomDate(checkoutTime);
    if (
      Temporal.Duration.compare(
        checkin.until(checkout),
        Temporal.Duration.from({ minutes: 10 })
      ) > 0
    ) {
      return {
        id: customerNumber,
        checkin,
        checkout,
        customer: customerId,
        realCheckout: true,
        reason: '',
      };
    }

    return {
      id: customerNumber,
      checkin,
      checkout: estimatedCheckout,
      customer: customerId,
      realCheckout: false,
      reason: 'DOUBLE_SCAN',
    };
  }

  return {
    id: customerNumber,
    checkin,
    checkout: estimatedCheckout,
    customer: customerId,
    realCheckout: false,
    reason: 'PREDICTION',
  };
}
