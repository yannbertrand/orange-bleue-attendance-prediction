import { getMagicLineInfo } from '../scripts/utils/env.js';
import { getCustomer } from './models/customer.js';

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

  return result.checkins.map((c) => getCustomer(c));
}

export async function getLiveCheckouts() {
  const { studioId, cookie } = getMagicLineInfo();

  const response = await fetch(
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

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  const result = await response.json();

  return result.map((c) => getCustomer(c));
}
