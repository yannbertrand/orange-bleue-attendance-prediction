import { Temporal } from 'temporal-polyfill';

export const availableCourseSlotStatuses = ['CANCELLED', 'PLANNED', 'FINISHED'];

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
  if (!Number.isInteger(bookedParticipants)) {
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
    name,
    bookedParticipants,
    appointmentStatus,
    startDateTime,
    endDateTime,
  };
}
