import { Temporal } from 'temporal-polyfill';
import { getAttendanceLiveNumber } from '../../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { isDayTime } from '../../scripts/utils/date.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getNetlifyLastEvent, store } from '../../src/io/read-netlify-data.js';
import { setNetlifyEvent } from '../../src/io/write-netlify-data.js';

export const config = {
  schedule: '* * * * *',
};

export default async () => {
  const pastAttendance = await getNetlifyLastEvent();
  const attendance = await getAttendanceLiveNumber();
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

    await setNetlifyEvent(newEvent);

    console.log(`Saved 1 new data row`);
  } else {
    console.log(`It's night time!`);

    const liveCourse = getCourse();
    const newEvent = getEventToSave({ attendance, evolution, liveCourse });
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await setNetlifyEvent(newEvent);

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

function getEvolution({ arrived, leftOfTimeout, leftBeforeTimeout } = {}) {
  return {
    arrived: arrived,
    leftOfTimeout: leftOfTimeout,
    leftBeforeTimeout: leftBeforeTimeout,
  };
}

function getCourse({ courseParticipants, courseName, courseStatus } = {}) {
  return {
    courseParticipants: courseParticipants ?? '',
    courseName: courseName ?? '',
    courseStatus: courseStatus ?? '',
  };
}
