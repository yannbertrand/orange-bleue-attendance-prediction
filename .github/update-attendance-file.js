import { getAttendanceLiveNumber } from '../scripts/get-attendance-live-number.js';
import { getTodayCourses } from '../scripts/get-today-courses.js';
import { updateAttendanceFile } from '../scripts/write-data.js';

try {
  const liveAttendance = await getAttendanceLiveNumber();
  const attendance = {
    date: liveAttendance.date,
    visitors: liveAttendance.visitors,
  };

  const todayCourses = await getTodayCourses();
  const foundCourse = todayCourses.find((course) => {
    return (
      course.startDateTime <= attendance.date &&
      attendance.date <= course.endDateTime
    );
  });
  const liveCourse = {
    courseParticipants: foundCourse?.bookedParticipants ?? '',
    courseName: foundCourse?.name ?? '',
    courseStatus: foundCourse?.appointmentStatus ?? '',
  };

  console.log(`Got 1 new data row`);

  await updateAttendanceFile({ ...attendance, ...liveCourse });

  console.log('Saved 1 new data row');
} catch (error) {
  console.error(`Could not get attendance ${error}`);
}
