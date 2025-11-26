import { Temporal } from 'temporal-polyfill';
import { getOrangeBleueInfo } from '../scripts/utils/env.js';
import { getCourseSlot } from './models/course-slot.js';

export async function getTodayCourses() {
  const { studioId, authToken, cookie } = getOrangeBleueInfo();

  const todayAsString = Temporal.Now.plainDateISO().toString();
  const response = await fetch(
    `https://monespace.lorangebleue.fr/nox/v2/bookableitems/courses/with-canceled?organizationUnitIds=${studioId}&startDate=${todayAsString}&endDate=${todayAsString}&courseAvailability=ALL&maxResults=10000`,
    {
      headers: {
        Host: 'monespace.lorangebleue.fr',
        accept: '*/*',
        'x-public-facility-group':
          'BRANDEDAPPNEPASSUPPRIMER-AAAD3F1070464BC09E41ADE2E48E2459',
        priority: 'u=3, i',
        'accept-language': 'fr',
        'x-nox-client-version': '3.77.0',
        'x-nox-client-type': 'APP_V5',
        'user-agent': 'Dart/3.9 (dart:io) ios/Version 26.1 (Build 23B85)',
        'x-auth-token': authToken,
        Cookie: cookie,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const courses = await response.json();
  const todayCourses = [];
  for (const course of courses) {
    for (const slot of course.slots) {
      const newCourse = getCourseSlot(
        course.name,
        course.bookedParticipants ?? 0,
        course.appointmentStatus,
        slot.startDateTime,
        slot.endDateTime
      );
      todayCourses.push(newCourse);
    }
  }

  return todayCourses;
}
