import { getNow } from '../../src/utils/date.js';

export function isDayTime() {
  const frenchHours = getNow();
  return frenchHours.hour >= 6 && frenchHours.hour < 23;
}
