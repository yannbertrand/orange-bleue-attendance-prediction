export async function getAttendanceLiveNumber(
  studioId = '1229318070',
  authToken = '44274883-9187-4ebd-92f8-b92fb4fb9d3d',
  cookie = 'didomi_token=eyJ1c2VyX2lkIjoiMTlhMWMzODAtOGRkYy02NTI3LWE0OTItODMwNTI4YjczMWMyIiwiY3JlYXRlZCI6IjIwMjUtMTAtMjVUMTY6MzM6NDUuNjkzWiIsInVwZGF0ZWQiOiIyMDI1LTEwLTI1VDE2OjMzOjQ1LjY5NFoiLCJ2ZXJzaW9uIjpudWxsfQ=='
) {
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

  const result = await response.json();
  const date = new Date(response.headers.get('date') ?? new Date());

  return {
    date,
    visitors: result.value,
  };
}
