import { getUserHistoryReport } from '../scrapper/get-user-history-report.js';
import { updateCalendarFile } from '../src/io/update-calendar-file.js';
import { getCalendar } from '../src/utils/calendar/ics.js';

const visits = await getUserHistoryReport();

console.log(`Found ${visits.length} visits`);

const calendar = getCalendar(visits);

const { nbOfUpdatedRows, nbOfNewRows } = await updateCalendarFile(calendar);

console.log(
  `Saved ${nbOfNewRows} new data row and updated ${nbOfUpdatedRows} row`,
);
