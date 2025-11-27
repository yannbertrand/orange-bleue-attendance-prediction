import { getAttendanceLiveNumber } from '../../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { isDayTime } from '../../scripts/utils/date.js';
import { estimateEvolution } from '../../src/calculate.js';
import { getActiveCourse } from '../../src/io/attendance/get-active-course.js';
import { getNetlifyLastEvent } from '../../src/io/read-netlify-data.js';
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
    const liveCourse = getActiveCourse(todayCourses, attendance.date);
    const newEvent = { ...attendance, ...evolution, ...liveCourse };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await setNetlifyEvent(newEvent);

    console.log(`Saved 1 new data row`);
  } else {
    console.log(`It's night time!`);

    const newEvent = { ...attendance, ...evolution };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await setNetlifyEvent(newEvent);

    console.log('Saved 1 new data row');
  }

  return new Response();
};

function getEvolution({ arrived, leftOfTimeout, leftBeforeTimeout } = {}) {
  return {
    arrived: arrived,
    leftOfTimeout: leftOfTimeout,
    leftBeforeTimeout: leftBeforeTimeout,
  };
}
