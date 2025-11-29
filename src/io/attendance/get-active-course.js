export function getActiveCourse(courses, date) {
  return courses.find(({ startDateTime, endDateTime }) =>
    date.isBetween(startDateTime, endDateTime)
  );
}
