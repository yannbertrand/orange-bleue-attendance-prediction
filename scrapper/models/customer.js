import { CustomDate } from '../../src/utils/date.js';

export function getCustomer({ customerNumber, checkinTime, checkoutTime }) {
  if (!customerNumber.startsWith('FF0')) {
    throw new Error(`Customer invalid number: "${customerNumber}"`);
  }

  const checkin = new CustomDate(checkinTime);
  if (checkoutTime) {
    return {
      id: customerNumber,
      checkin,
      checkout: new CustomDate(checkoutTime),
    };
  }
  return { id: customerNumber, checkin };
}
