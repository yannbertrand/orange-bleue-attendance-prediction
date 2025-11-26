import { getStore } from '@netlify/blobs';
import { Temporal } from 'temporal-polyfill';
import { getAttendanceLiveNumber } from '../../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { isDayTime } from '../../scripts/utils/date.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getZonedDateTime } from '../../src/io/read-attendance-events-file.js';

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

    const newEvent = getEventToSave({ attendance, evolution, liveCourse });
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await store.setJSON(newEvent.date.toPlainDateTime(), newEvent);

    console.log(`Saved 1 new data row`);
  } else {
    console.log(`It's night time!`);

    const liveCourse = getCourse();
    const newEvent = getEventToSave({ attendance, evolution, liveCourse });
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await store.setJSON(attendance.date.toPlainDateTime().toString(), newEvent);

    console.log('Saved 1 new data row');
  }

  return new Response();
};

function getEventToSave({ attendance, evolution, liveCourse }) {
  return {
    ...attendance,
    ...evolution,
    ...liveCourse,
  };
}

function getAttendance({ date, visitors } = {}) {
  if (typeof date === 'string') {
    return {
      date: getZonedDateTime(date),
      visitors: visitors ?? 0,
    };
  }
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
