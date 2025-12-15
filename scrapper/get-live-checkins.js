import { getMagicLineInfo } from '../scripts/utils/env.js';
import { getCustomerVisit } from './models/customer.js';

export async function getLiveCheckins() {
  const { studioId, cookie } = getMagicLineInfo();

  const response = await fetch(
    `https://lob.web.magicline.com/rest-api/checkin?organizationUnitId=${studioId}&offset=0&maxResults=100&search=&filter=&sortedby=checkinTime&checkouts=false&direction=DESCENDING&showBadges=false`,
    {
      credentials: 'include',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'fr,en;q=0.5',
        'X-ML-WC-VERSION': '3.458.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-GPC': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Cookie: cookie,
      },
      referrer: 'https://lob.web.magicline.com/',
      method: 'GET',
      mode: 'cors',
    }
  );

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  return result.checkins.map((c) => getCustomerVisit(c));
}

export async function getLiveCheckouts() {
  const { studioId, cookie } = getMagicLineInfo();

  const response1 = await fetch(
    `https://lob.web.magicline.com/rest-api/checkout?organizationUnitId=${studioId}&offset=0&maxResults=100&search=&filter=&sortedby=checkinTime&checkouts=false&direction=DESCENDING&showBadges=false`,
    {
      credentials: 'include',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'fr,en;q=0.5',
        'X-ML-WC-VERSION': '3.458.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-GPC': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Cookie: cookie,
      },
      referrer: 'https://lob.web.magicline.com/',
      method: 'GET',
      mode: 'cors',
    }
  );

  const response2 = await fetch(
    `https://lob.web.magicline.com/rest-api/checkout?organizationUnitId=${studioId}&offset=100&maxResults=100&search=&filter=&sortedby=checkinTime&checkouts=false&direction=DESCENDING&showBadges=false`,
    {
      credentials: 'include',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:146.0) Gecko/20100101 Firefox/146.0',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'fr,en;q=0.5',
        'X-ML-WC-VERSION': '3.458.5',
        'X-Requested-With': 'XMLHttpRequest',
        'Sec-GPC': '1',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        Pragma: 'no-cache',
        'Cache-Control': 'no-cache',
        Cookie: cookie,
      },
      referrer: 'https://lob.web.magicline.com/',
      method: 'GET',
      mode: 'cors',
    }
  );

  if (!response1.ok) {
    throw new Error(`${response1.status} ${response1.statusText}`);
  }
  if (!response2.ok) {
    throw new Error(`${response2.status} ${response2.statusText}`);
  }

  const result1 = await response1.json();
  const result2 = await response2.json();

  return [...result1, ...result2].map((c) => getCustomerVisit(c));
}
