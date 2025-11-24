import { Temporal } from 'temporal-polyfill';

export function isDayTime() {
  const frenchHours = Temporal.Now.zonedDateTimeISO('Europe/Paris');
  return frenchHours.hour >= 6 && frenchHours.hour < 23;
}
