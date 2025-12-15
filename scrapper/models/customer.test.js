import { describe, expect, it } from 'vitest';
import { CustomDate } from '../../src/utils/date.js';
import { getCustomer } from './customer.js';

describe('getCustomer', () => {
  it('should throw if invalid customerNumber', () => {
    expect(() => getCustomer({ customerNumber: 1 })).toThrow();
  });

  describe('when checkout not available', () => {
    it('should predict checkout', () => {
      const customer = getCustomer({
        customerId: 1,
        customerNumber: 'FF01',
        checkinTime: '2025-12-26T12:00:00+01:00',
      });

      expect(customer).toStrictEqual({
        id: 'FF01',
        checkin: new CustomDate('2025-12-26T12:00:00+01:00'),
        checkout: new CustomDate('2025-12-26T13:00:00+01:00'),
        customer: 1,
        realCheckout: false,
        reason: 'PREDICTION',
      });
    });
  });

  describe('when checkout is available', () => {
    describe('when is supposedly double scan', () => {
      it('should correct checkout', () => {
        const customer = getCustomer({
          customerId: 1,
          customerNumber: 'FF01',
          checkinTime: '2025-12-26T12:00:00+01:00',
          checkoutTime: '2025-12-26T12:01:00+01:00',
        });

        expect(customer).toStrictEqual({
          id: 'FF01',
          checkin: new CustomDate('2025-12-26T12:00:00+01:00'),
          checkout: new CustomDate('2025-12-26T13:00:00+01:00'),
          customer: 1,
          realCheckout: false,
          reason: 'DOUBLE_SCAN',
        });
      });

      describe('when visit timed out', () => {
        it('should correct checkout', () => {
          const customer = getCustomer({
            customerId: 1,
            customerNumber: 'FF01',
            checkinTime: '2025-12-26T12:00:00+01:00',
            checkoutTime: '2025-12-26T14:00:00+01:00',
          });

          expect(customer).toStrictEqual({
            id: 'FF01',
            checkin: new CustomDate('2025-12-26T12:00:00+01:00'),
            checkout: new CustomDate('2025-12-26T13:00:00+01:00'),
            customer: 1,
            realCheckout: false,
            reason: 'VISIT_TIMEOUT',
          });
        });
      });

      describe('when real checkout', () => {
        it('should keep checkout value', () => {
          const customer = getCustomer({
            customerId: 1,
            customerNumber: 'FF01',
            checkinTime: '2025-12-26T12:00:00+01:00',
            checkoutTime: '2025-12-26T12:34:00+01:00',
          });

          expect(customer).toStrictEqual({
            id: 'FF01',
            checkin: new CustomDate('2025-12-26T12:00:00+01:00'),
            checkout: new CustomDate('2025-12-26T12:34:00+01:00'),
            customer: 1,
            realCheckout: true,
            reason: '',
          });
        });
      });
    });
  });
});
