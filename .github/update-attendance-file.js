import { Temporal } from 'temporal-polyfill';
import { getAttendanceLiveNumber } from '../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../scrapper/get-today-courses.js';
import { isDayTime } from '../scripts/utils/date.js';
import { estimateEvolution } from '../src/calculate.js';
import { updateAttendanceFile } from '../src/io/add-event-to-attendance-file.js';
import { readAttendanceFile } from '../src/io/read-attendance-events-file.js';

const pastAttendance = await readAttendanceFile();
const liveAttendance = await getAttendanceLiveNumber();
const attendance = getAttendance({
  date: liveAttendance.date,
  visitors: liveAttendance.visitors,
});
const evolution = getEvolution(
  estimateEvolution([pastAttendance.at(-1), attendance]).at(-1)
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

  await updateAttendanceFile(newEvent);

  console.log(`Saved 1 new data row`);
} else {
  console.log(`It's night time!`);

  if (liveAttendance.visitors > 0) {
    console.log(`Still at least one visitors, saving as usual`);

    const newEvent = { ...attendance, ...evolution, ...getCourse() };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await updateAttendanceFile(newEvent);

    console.log('Saved 1 new data row');
  } else {
    const currentAttendance = await readAttendanceFile();
    const lastAttendanceEvent = currentAttendance.at(-1);
    if (lastAttendanceEvent?.visitors > 0) {
      console.log(`Last visitor left, saving all night events (0 visitors)`);
      // Last visitor left
      let date = attendance.date;
      const newEvents = [];
      while (date.hour < 6) {
        newEvents.push({
          ...getAttendance({ date, visitors: 0 }),
          ...getEvolution({
            arrived: 0,
            leftOfTimeout: 0,
            leftBeforeTimeout: 0,
          }),
          ...getCourse(),
        });
        date = date.add({ minutes: 20 });
      }

      console.log(
        `Got ${newEvents.length} new data row: ${JSON.stringify(newEvents)}`
      );

      for (const event of newEvents) {
        await updateAttendanceFile(event);
      }

      console.log(`Saved ${newEvents.length} new data row`);
    } else {
      console.log(`Already saved night visits`);
    }
  }
}

function getAttendance({ date, visitors } = {}) {
  return {
    date: date,
    visitors: visitors,
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
