import { writeFile } from 'node:fs';
import attendance from '../data/attendance.json' with { type: 'json' };

export const updateAttendanceFile = async (newAttendanceLiveData) => {
	const allTrips = [...attendance, newAttendanceLiveData];

	await writeFile(
		'./data/attendance.json',
		JSON.stringify(allTrips),
		'utf8',
		console.error,
	);

	return newAttendanceLiveData;
};
