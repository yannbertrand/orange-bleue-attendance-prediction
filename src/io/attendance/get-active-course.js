import { Temporal } from 'temporal-polyfill';

export function getActiveCourse(courses, date) {
  return courses.find(({ startDateTime, endDateTime }) => {
    return (
      Temporal.ZonedDateTime.compare(startDateTime, date) <= 0 &&
      Temporal.ZonedDateTime.compare(date, endDateTime) <= 0
    );
  });
}
