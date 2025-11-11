export async function getFutureCourses(
  studioId = '1229318070',
  authToken = '44274883-9187-4ebd-92f8-b92fb4fb9d3d',
  cookie = 'didomi_token=eyJ1c2VyX2lkIjoiMTlhMWMzODAtOGRkYy02NTI3LWE0OTItODMwNTI4YjczMWMyIiwiY3JlYXRlZCI6IjIwMjUtMTAtMjVUMTY6MzM6NDUuNjkzWiIsInVwZGF0ZWQiOiIyMDI1LTEwLTI1VDE2OjMzOjQ1LjY5NFoiLCJ2ZXJzaW9uIjpudWxsfQ=='
) {
  const today = new Date();
  const todayYear = today.getFullYear();
  const todayMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const todayDay = today.getDate().toString().padStart(2, '0');
  const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
  const tomorrowYear = tomorrow.getFullYear();
  const tomorrowMonth = (tomorrow.getMonth() + 1).toString().padStart(2, '0');
  const tomorrowDay = tomorrow.getDate().toString().padStart(2, '0');
  const todayAsString = `${todayYear}-${todayMonth}-${todayDay}`;
  const tomorrowAsString = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;
  const response = await fetch(
    `https://monespace.lorangebleue.fr/nox/v2/bookableitems/courses/with-canceled?organizationUnitIds=${studioId}&startDate=${todayAsString}&endDate=${tomorrowAsString}&courseAvailability=ALL&maxResults=10000`,
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
  const date = new Date(response.headers.get('date') ?? new Date());
  const futureCourses = [];
  for (const course of courses) {
    for (const slot of course.slots) {
      const startDateTime = new Date(slot.startDateTime.split('[')[0]);
      if (date > startDateTime) {
        continue;
      }

      const newCourse = {
        date,
        name: course.name,
        bookedParticipants: course.bookedParticipants ?? 0,
        appointmentStatus: course.appointmentStatus,
        startDateTime: new Date(slot.startDateTime.split('[')[0]),
        endDateTime: new Date(slot.endDateTime.split('[')[0]),
      };
      futureCourses.push(newCourse);
    }
  }

  return futureCourses;
}
