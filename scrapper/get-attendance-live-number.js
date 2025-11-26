import { getOrangeBleueInfo } from '../scripts/utils/env.js';
import { getLiveAttendance } from './models/live-attendance.js';

export async function getAttendanceLiveNumber() {
  const { studioId, authToken, cookie } = getOrangeBleueInfo();

  const response = await fetch(
    `https://monespace.lorangebleue.fr/nox/v1/studios/${studioId}/utilization/v2/active-checkin`,
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

  const result = await response.json();

  return getLiveAttendance(response.headers.get('date'), result.value);
}
