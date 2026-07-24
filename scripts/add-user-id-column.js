import { createHash } from 'node:crypto';
import { writeFile } from 'node:fs/promises';
import { Temporal } from 'temporal-polyfill';
import { getLiveCheckouts } from '../scrapper/get-live-checkins.js';
import { readBetterAttendanceFile } from '../src/io/read-better-attendance-events-file.js';

// const checkouts = await getLiveCheckouts();
const attendanceData = await readBetterAttendanceFile();

const s = [];
for (const i of attendanceData) {
  s.push({ customer: i.customer, date: i.date, type: i.type });
}

const visits = [];
const customers = new Map();
for (const value of s) {
  if (customers.has(value.customer)) {
    // if (value.type !== 'CHECKOUT') {
    //   throw new Error(
    //     'stg stranged happened' +
    //       JSON.stringify(customers.get(value.customer)) +
    //       JSON.stringify(value)
    //   );
    // }
    if (value.type === 'CHECKOUT') {
      visits.push({
        customer: value.customer,
        duration: value.date.since(customers.get(value.customer)),
        checkin: customers.get(value.customer),
        checkout: value.date,
      });
    }
    customers.delete(value.customer);
  } else {
    customers.set(value.customer, value.date);
  }
}
console.log(customers);

const filteredVisits = visits.filter(
  (v) =>
    Temporal.Duration.compare(
      v.duration,
      Temporal.Duration.from({ hours: 2 })
    ) === 0
);

const sortedVisits = filteredVisits.sort((v1, v2) =>
  Temporal.Duration.compare(v1.duration, v2.duration)
);
console.log(sortedVisits.length, visits.length);
