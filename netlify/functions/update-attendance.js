import { getStore } from '@netlify/blobs';
import { Temporal } from 'temporal-polyfill';
import { estimateEvolution } from '../../scripts/calculate.js';
import { getAttendanceLiveNumber } from '../../scripts/get-attendance-live-number.js';
import { getTodayCourses } from '../../scripts/get-today-courses.js';
import { getZonedDateTime } from '../../scripts/read-data.js';
import { isDayTime } from '../../scripts/utils/date.js';

export const config = {
  schedule: '*/2 * * * *',
};

export default async () => {
  const store = getStore('attendance');

  const { blobs } = await store.list();
  const foundPastAttendanceBlob = blobs.at(-1);
  let pastAttendance;
  if (foundPastAttendanceBlob) {
    pastAttendance = await store.get(foundPastAttendanceBlob.key, {
      type: 'json',
    });
  }
  pastAttendance = getAttendance(pastAttendance);
  const liveAttendance = await getAttendanceLiveNumber();
  const attendance = getAttendance({
    date: liveAttendance.date,
    visitors: liveAttendance.visitors,
  });
  const evolution = getEvolution(
    estimateEvolution([pastAttendance, attendance]).at(-1)
  );

  if (isDayTime()) {
    console.log(`It's daytime!`);

    const todayCourses = await getTodayCourses();
    const foundCourse = todayCourses.find((course) => {
      return (
        Temporal.ZonedDateTime.compare(course.startDateTime, attendance.date) <=
          0 &&
        Temporal.ZonedDateTime.compare(attendance.date, course.endDateTime) <= 0
      );
    });
    const liveCourse = getCourse(foundCourse);

    const newEvent = { ...attendance, ...evolution, ...liveCourse };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await store.setJSON(attendance.date.toPlainDateTime().toString(), newEvent);

    console.log(`Saved 1 new data row`);
  } else {
    console.log(`It's night time!`);

    const newEvent = { ...attendance, ...evolution, ...getCourse() };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await store.setJSON(attendance.date.toPlainDateTime().toString(), newEvent);

    console.log('Saved 1 new data row');
  }

  return new Response();
};

function getAttendance({ date, visitors } = {}) {
  return {
    date: date ?? Temporal.Now.zonedDateTimeISO('Europe/Paris'),
    visitors: visitors ?? 0,
  };
}

function getEvolution({ arrived, leftOfTimeout, leftBeforeTimeout } = {}) {
  return {
    arrived: arrived,
    leftOfTimeout: leftOfTimeout,
    leftBeforeTimeout: leftBeforeTimeout,
  };
}

function getCourse({ bookedParticipants, name, appointmentStatus } = {}) {
  return {
    courseParticipants: bookedParticipants ?? '',
    courseName: name ?? '',
    courseStatus: appointmentStatus ?? '',
  };
}
