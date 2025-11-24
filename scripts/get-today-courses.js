import { Temporal } from 'temporal-polyfill';
import { getOrangeBleueInfo } from './utils/env.js';

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

  const courses = await response.json();
  const date =
    response.headers.get('date') != null
      ? Temporal.Instant.from(
          new Date(response.headers.get('date')).toISOString()
        )
      : Temporal.Now.instant;
  const todayCourses = [];
  for (const course of courses) {
    for (const slot of course.slots) {
      const newCourse = {
        date,
        name: course.name,
        bookedParticipants: course.bookedParticipants ?? 0,
        appointmentStatus: course.appointmentStatus,
        startDateTime: Temporal.Instant.from(slot.startDateTime.split('[')[0]),
        endDateTime: Temporal.Instant.from(slot.endDateTime.split('[')[0]),
      };
      todayCourses.push(newCourse);
    }
  }

  return todayCourses;
}
