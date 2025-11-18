import { getAttendanceLiveNumber } from '../scripts/get-attendance-live-number.js';
import { getTodayCourses } from '../scripts/get-today-courses.js';
import { readAttendanceFile } from '../scripts/read-data.js';
import { updateAttendanceFile } from '../scripts/write-data.js';

try {
  const liveAttendance = await getAttendanceLiveNumber();
  const attendance = {
    date: liveAttendance.date,
    visitors: liveAttendance.visitors,
  };

  if (isDayTime()) {
    console.log(`It's daytime!`);

    const todayCourses = await getTodayCourses();
    const foundCourse = todayCourses.find((course) => {
      return (
        course.startDateTime <= attendance.date &&
        attendance.date <= course.endDateTime
      );
    });
    const liveCourse = getCourse(foundCourse);

    const newEvent = { ...attendance, ...liveCourse };
    console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

    await updateAttendanceFile(newEvent);

    console.log(`Saved 1 new data row`);
  } else {
    console.log(`It's night time!`);

    const currentAttendance = await readAttendanceFile();
    const lastAttendanceEvent = currentAttendance.at(-1);
    if (lastAttendanceEvent?.visitors !== 0) {
      if (liveAttendance.visitors > 0) {
        console.log(`Still at least one visitors, saving as usual`);

        const newEvent = { ...attendance, ...getCourse() };
        console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

        await updateAttendanceFile(newEvent);

        console.log('Saved 1 new data row');
      } else {
        console.log(`Last visitor left, saving all night events (0 visitors)`);
        // Last visitor left
        let date = attendance.date;
        const newEvents = [];
        while (date.getHours() < 6) {
          newEvents.push({
            date,
            visitors: 0,
            ...getCourse(),
          });
          date = new Date(date.getTime() + 20 * 60 * 1000);
        }

        console.log(
          `Got ${newEvents.length} new data row: ${JSON.stringify(newEvents)}`
        );

        for (const event of newEvents) {
          await updateAttendanceFile(event);
        }
        console.log({ newEvents });

        console.log(`Saved ${newEvents.length} new data row`);
      }
    } else {
      // Already saved night events
    }
  }
} catch (error) {
  console.error(`Could not get attendance ${error}`);
}

function getCourse({ bookedParticipants, name, appointmentStatus } = {}) {
  return {
    courseParticipants: bookedParticipants ?? '',
    courseName: name ?? '',
    courseStatus: appointmentStatus ?? '',
  };
}

function isDayTime() {
  const today = new Date();
  const currentHours = today.getHours();
  return currentHours >= 6 && currentHours < 24;
}
