import { Temporal } from 'temporal-polyfill';

export const availableCourseSlotStatuses = ['CANCELED', 'PLANNED', 'FINISHED'];

export function getCourses(rawCourses) {
  if (!Array.isArray(rawCourses)) {
    throw new Error('Courses parameter should be an array');
  }

  if (rawCourses.some((c) => !Array.isArray(c.slots))) {
    throw new Error(
      'Courses parameter array items should all contain a `slots` array'
    );
  }

  const courses = [];
  for (const rawCourse of rawCourses) {
    for (const slot of rawCourse.slots) {
      courses.push(
        getCourseSlot(
          rawCourse.name,
          rawCourse.bookedParticipants,
          rawCourse.appointmentStatus,
          slot.startDateTime,
          slot.endDateTime
        )
      );
    }
  }

  return courses;
}

export function getCourseSlot(
  name,
  bookedParticipants,
  appointmentStatus,
  startDateTimeString,
  endDateTimeString
) {
  if (name.length < 1) {
    throw new Error(`CourseSlot invalid name: "${name}"`);
  }
  const courseParticipants = bookedParticipants ?? 0;
  if (!Number.isInteger(courseParticipants)) {
    throw new Error(
      `CourseSlot invalid bookedParticipants: "${bookedParticipants}"`
    );
  }
  if (!availableCourseSlotStatuses.includes(appointmentStatus)) {
    throw new Error(
      `CourseSlot invalid appointmentStatus: "${appointmentStatus}"`
    );
  }

  const startDateTime = Temporal.ZonedDateTime.from(startDateTimeString);
  const endDateTime = Temporal.ZonedDateTime.from(endDateTimeString);

  return {
    courseName: name,
    courseParticipants: courseParticipants,
    courseStatus: appointmentStatus,
    startDateTime,
    endDateTime,
  };
}
