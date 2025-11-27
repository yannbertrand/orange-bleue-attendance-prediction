import { getAttendanceLiveNumber } from '../../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../../scrapper/get-today-courses.js';
import { isDayTime } from '../../scripts/utils/date.js';
import { getActiveCourse } from '../../src/io/attendance/get-active-course.js';
import { setNetlifyEvent } from '../../src/io/write-netlify-data.js';

export const config = {
  schedule: '* * * * *',
};

export default async () => {
  const attendance = await getAttendanceLiveNumber();

  if (isDayTime()) {
    console.log(`It's daytime!`);

    const todayCourses = await getTodayCourses();
    const liveCourse = getActiveCourse(todayCourses, attendance.date);
    const newEvent = { ...attendance, ...liveCourse };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    const { modified } = await setNetlifyEvent(newEvent);

    if (modified) {
      console.log(`Saved 1 new data row`);
    } else {
      console.log(`No new row saved`);
    }
  } else {
    console.log(`It's night time!`);

    const newEvent = { ...attendance };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    const { modified } = await setNetlifyEvent(newEvent);

    if (modified) {
      console.log(`Saved 1 new data row`);
    } else {
      console.log(`No new row saved`);
    }
  }

  return new Response();
};
