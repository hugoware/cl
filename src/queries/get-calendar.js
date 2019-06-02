
import Schedule from '../schedule';

export default async function getCalendar() {
	const schedule = Schedule.current.getAvailability();
	return {
		seats: Schedule.seatLimit,
		schedule
	};
}
