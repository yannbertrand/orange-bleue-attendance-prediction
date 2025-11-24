export function getOrangeBleueInfo() {
  if (!process.env.ORANGE_BLEUE_STUDIO_ID) {
    throw new Error('Missing env var ORANGE_BLEUE_STUDIO_ID');
  }
  if (!process.env.ORANGE_BLEUE_AUTH_TOKEN) {
    throw new Error('Missing env var ORANGE_BLEUE_AUTH_TOKEN');
  }
  if (!process.env.ORANGE_BLEUE_COOKIE) {
    throw new Error('Missing env var ORANGE_BLEUE_COOKIE');
  }
  return {
    studioId: process.env.ORANGE_BLEUE_STUDIO_ID,
    authToken: process.env.ORANGE_BLEUE_AUTH_TOKEN,
    cookie: process.env.ORANGE_BLEUE_COOKIE,
  };
}
