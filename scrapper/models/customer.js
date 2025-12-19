import { Temporal } from 'temporal-polyfill';
import { CustomDate } from '../../src/utils/date.js';

export const officialEstimatedVisitDuration = Temporal.Duration.from({
  hours: 2,
});
const customEstimatedVisitDuration = Temporal.Duration.from({ hours: 1 });

export function getCustomerVisit(
  { customerId, customerNumber, checkinTime, checkoutTime },
  doCustomPrediction
) {
  if (!customerNumber.startsWith('FF0')) {
    throw new Error(`Customer invalid number: "${customerNumber}"`);
  }

  const checkin = new CustomDate(checkinTime);
  const officialEstimatedCheckout = checkin.add(officialEstimatedVisitDuration);
  const customEstimatedCheckout = checkin.add(customEstimatedVisitDuration);
  if (checkoutTime) {
    const checkout = new CustomDate(checkoutTime);

    if (
      Temporal.Duration.compare(
        checkin.until(checkout),
        Temporal.Duration.from({ minutes: 10 })
      ) > 0
    ) {
      if (checkout.equals(officialEstimatedCheckout)) {
        return {
          id: customerNumber,
          checkin,
          checkout: doCustomPrediction ? customEstimatedCheckout : checkout,
          customer: customerId,
          realCheckout: doCustomPrediction ? false : true,
          reason: doCustomPrediction ? 'VISIT_TIMEOUT' : '',
        };
      }
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
      checkout: doCustomPrediction ? customEstimatedCheckout : checkout,
      customer: customerId,
      realCheckout: doCustomPrediction ? false : true,
      reason: doCustomPrediction ? 'DOUBLE_SCAN' : '',
    };
  }

  return {
    id: customerNumber,
    checkin,
    checkout: doCustomPrediction ? customEstimatedCheckout : undefined,
    customer: customerId,
    realCheckout: doCustomPrediction ? false : true,
    reason: doCustomPrediction ? 'PREDICTION' : '',
  };
}
