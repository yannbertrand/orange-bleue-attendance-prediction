import { getAttendanceLiveNumber } from '../scripts/get-attendance-live-number.js';
import { getTodayCourses } from '../scripts/get-today-courses.js';
import { updateAttendanceFile } from '../scripts/write-data.js';

try {
  const liveAttendance = await getAttendanceLiveNumber();

  const todayCourses = await getTodayCourses();
  const foundCourse = todayCourses.find((course) => {
    return (
      course.startDateTime <= liveAttendance.date &&
      liveAttendance.date <= course.endDateTime
    );
  });
  const liveCourse = {
    courseParticipants: foundCourse?.bookedParticipants ?? '',
    courseName: foundCourse?.name ?? '',
    courseStatus: foundCourse?.appointmentStatus ?? '',
  };

  console.log(`Got 1 new data row`);

  await updateAttendanceFile({ ...liveAttendance, ...liveCourse });

  console.log('Saved 1 new data row');
} catch (error) {
  console.error(`Could not get attendance ${error}`);
}
