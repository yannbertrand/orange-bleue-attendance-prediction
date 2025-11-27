export function getNetlifyInfo() {
  if (!process.env.NETLIFY_SITE_ID) {
    throw new Error('Missing env var NETLIFY_SITE_ID');
  }
  if (!process.env.NETLIFY_AUTH_TOKEN) {
    throw new Error('Missing env var NETLIFY_AUTH_TOKEN');
  }
  return {
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_AUTH_TOKEN,
    rateLimitChunkSize: 250,
    rateLimitTimeout: 60 * 1_000,
  };
}

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
