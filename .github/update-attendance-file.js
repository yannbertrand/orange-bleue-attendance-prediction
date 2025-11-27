import { getAttendanceLiveNumber } from '../scrapper/get-attendance-live-number.js';
import { getTodayCourses } from '../scrapper/get-today-courses.js';
import { isDayTime } from '../scripts/utils/date.js';
import { addEventToAttendanceFile } from '../src/io/add-event-to-attendance-file.js';
import { getActiveCourse } from '../src/io/attendance/get-active-course.js';
import { readAttendanceFile } from '../src/io/read-attendance-events-file.js';

const attendance = await getAttendanceLiveNumber();

if (isDayTime()) {
  console.log(`It's daytime!`);

  const todayCourses = await getTodayCourses();
  const liveCourse = getActiveCourse(todayCourses, attendance.date);

  const newEvent = { ...attendance, ...liveCourse };
  console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

  await addEventToAttendanceFile(newEvent);

  console.log(`Saved 1 new data row`);
} else {
  console.log(`It's night time!`);

  if (liveAttendance.visitors > 0) {
    console.log(`Still at least one visitors, saving as usual`);

    const newEvent = { ...attendance };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await addEventToAttendanceFile(newEvent);

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
          ...{ date, visitors: 0 },
        });
        date = date.add({ minutes: 20 });
      }

      console.log(
        `Got ${newEvents.length} new data row: ${JSON.stringify(newEvents)}`
      );

      for (const event of newEvents) {
        await addEventToAttendanceFile(event);
      }

      console.log(`Saved ${newEvents.length} new data row`);
    } else {
      console.log(`Already saved night visits`);
    }
  }
}
