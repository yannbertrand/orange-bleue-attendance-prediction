import { getStore } from '@netlify/blobs';
import { estimateEvolution } from '../../scripts/calculate.js';
import { getAttendanceLiveNumber } from '../../scripts/get-attendance-live-number.js';
import { getTodayCourses } from '../../scripts/get-today-courses.js';

export const config = {
  schedule: '*/5 * * * *',
};

export default async () => {
  const store = getStore('attendance');

  try {
    const { blobs } = await store.list();
    const pastAttendance = await store.get(blobs.at(-1)?.key);
    const liveAttendance = await getAttendanceLiveNumber();
    const attendance = getAttendance({
      date: liveAttendance.date,
      visitors: liveAttendance.visitors,
    });
    const evolution = getEvolution(
      estimateEvolution([pastAttendance, attendance])
    );

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
      console.log(JSON.stringify(evolution));

      const newEvent = { ...attendance, ...evolution, ...liveCourse };
      console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

      await store.setJSON(attendance.date.toISOString(), newEvent);

      console.log(`Saved 1 new data row`);
    } else {
      console.log(`It's night time!`);

      const newEvent = { ...attendance, ...evolution, ...getCourse() };
      console.log(`Got 1 new data row: ${JSON.stringify(newEvent)}`);

      await store.setJSON(attendance.date.toISOString(), newEvent);

      console.log('Saved 1 new data row');
    }
  } catch (error) {
    console.error(`Could not get attendance`);
    console.log(error);
  }
  return new Response();
};

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

function isDayTime() {
  const today = new Date();
  const currentHours = today.getUTCHours();
  return currentHours >= 5 && currentHours < 23;
}
