export function toCustomerVisit(events) {
  const checkin = events.find((v) => v.type === 'CHECKIN');
  const checkout = events.find((v) => v.type === 'CHECKOUT');
  return {
    id: checkin.customer,
    checkin: checkin.date,
    checkout: checkout.date,
    customer: checkin.customer,
    realCheckout: checkout.isRealDate,
    reason: checkout.reason,
  };
}
