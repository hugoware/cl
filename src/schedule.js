import _ from 'lodash';
import $database from './storage/database';

// reserved duration for a timeslot
const DURATION = 5;
const THRESHOLD = 0.8;
const SEAT_LIMIT = 15;

/** handles tracking CodeLab schedules */
export default class Schedule {

	/** @type {Schedule} */
	static current = { };

	// creates a new schedule
	constructor() {
		
		// create the empty schedule
		this.slots = [];
		this.sessions = [];
		for (let day = 0; day < 7; day++)
			for (let hour = 0; hour < 24; hour++)
				for (let interval = 0; interval < 4; interval += 1) {
					this.slots.push(0);
					this.sessions.push(createDate(day, hour, interval));
				}
	}

	/** loads the schedule from the database */
	static init() {
		return new Promise(async resolve => {

			// compare the schedule
			const timeslots = await $database.users.find({ timeSlot: { $exists: true } })
				.project({ _id: 0, timeSlot: 1 })
				.toArray();

			// load all schedule information
			const schedule = new Schedule();
			const indexes = _.map(timeslots, 'timeSlot');
			schedule.populate(indexes);

			// save info
			Schedule.current = schedule;
			resolve();
		});
		
	}

	// get available classes
	getAvailability() {

		// create the standard schedule
		const tuesday = this.getSchedule({
			date: 2,
			start: { hour: 15, interval: 2 },
			end: { hour: 19, interval: 2 },
			seats: SEAT_LIMIT,
		});

		const thursday = this.getSchedule({
			date: 4,
			start: { hour: 15, interval: 2 },
			end: { hour: 19, interval: 2 },
			seats: SEAT_LIMIT,
		});

		const saturday = this.getSchedule({
			date: 6,
			start: { hour: 13, interval: 2 },
			end: { hour: 17, interval: 2 },
			seats: SEAT_LIMIT,
		});

		const sunday = this.getSchedule({
			date: 0,
			start: { hour: 13, interval: 2 },
			end: { hour: 17, interval: 2 },
			seats: SEAT_LIMIT,
		});

		return [ tuesday, thursday, saturday, sunday ];
	}

	// helper to translate days to schedule indexes
	getIndex(day, time) {
		return timeToIndex(day, time);
	}

	getSession(index) {
		return this.sessions[index];
	}

	// checks if a timeslot has room or not
	checkTimeSlot(index) {
		const slot = this.slots[index];
		if (!_.isNumber(slot)) return false;
		return slot < SEAT_LIMIT;
	}

	// fills a slot without needing to reload
	// the entire schedule
	reserveSlot(index) {
		const slot = this.slots[index];
		if (!_.isNumber(slot)) return false;
		this.slots[index]++;
		return true;
	}

	// fill a bunch of ids
	populate(ids) {
		for (const id of ids)
			this.reserve(id);
	}

	// reserve a slot
	reserve(start) {
		// const start = idToIndex(id);
		const end = start + DURATION;
		for (let i = start; i < end; i++)
			this.slots[i] += 1;
	}

	// finds the schedule for a specific time
	getSchedule(options) {
		const slots = [ ];
		const date = options.date * 24 * 4;
		const start = date + (options.start.hour * 4) + options.start.interval;
		const end = date + (options.end.hour * 4) + options.end.interval;

		// get the day of week
		const day = options.date === 0 ? 'Sunday'
			: options.date === 1 ? 'Monday'
			: options.date === 2 ? 'Tuesday'
			: options.date === 3 ? 'Wednesday'
			: options.date === 4 ? 'Thursday'
			: options.date === 5 ? 'Friday'
			: options.date === 6 ? 'Saturday'
			: null;

		for (let i = start; i <= end; i++) {
			const reserved = this.slots[i];

			// determine the time
			let hour = Math.floor((i - date) / 4);
			const interval = (i - date) - (hour * 4);

			// create the time block
			const meridem = hour >= 12 ? 'PM' : 'AM';
			if (hour > 12) hour -= 12;
			if (hour === 0) hour = 12;

			// get the interval
			const minute = interval === 3 ? '45'
				: interval === 2 ? '30'
				: interval === 1 ? '15'
				: '00';

			// create the final time
			const time = `${hour}:${minute}`;
			const remaining = options.seats - reserved;
			const capacity = remaining / options.seats;
			let status = remaining === 0 ? 'full'
				: capacity < THRESHOLD ? 'limited'
				: '';

			// if (i % 6 === 0) status = 'limited';
			// if (i % 9 === 0) status = 'full';
			
			// save the timing slots
			slots.push({ time, meridem, remaining, status, index: i });
		}

		return { day, slots };

	}

}

// finds an appropriate index for a day
function dayToIndex(day) {
	return /sun/i.test(day) ? 0
		: /mon/i.test(day) ? 1
		: /tues/i.test(day) ? 2
		: /wed/i.test(day) ? 3
		: /thur/i.test(day) ? 4
		: /fri/i.test(day) ? 5
		: /sat/i.test(day) ? 6
		: NaN;
}


// converts a string time to a daily index
function timeToIndex(day, time) {
	const start = 24 * dayToIndex(day);

	// check the time of day
	let postMeridem;
	time = time.replace(/(am|pm)$/ig, match => {
		postMeridem = /pm/i.test(match);
		return '';
	});

	const parts = _.map(_.trim(time).split(':'), _.toNumber);
	
	// get the hour marker
	let hour = parts[0];
	if (hour === 12 && !postMeridem) hour = 0;
	hour += postMeridem ? 12 : 0;

	// get the minute marker
	const interval = parts[1] / 15;
	return start + (hour * 4) + interval;
}


function createDate(day, hour, interval) {
	
	// get the named day
	day = day === 0 ? 'Sunday'
		: day === 1 ? 'Monday'
		: day === 2 ? 'Tuesday'
		: day === 3 ? 'Wednesday'
		: day === 4 ? 'Thursday'
		: day === 5 ? 'Friday'
		: day === 6 ? 'Saturday'
		: null;

	// create the time block
	const meridem = hour >= 12 ? 'PM' : 'AM';
	if (hour > 12) hour -= 12;
	if (hour === 0) hour = 12;

	// get the interval
	const minute = interval === 3 ? '45'
		: interval === 2 ? '30'
		: interval === 1 ? '15'
		: '00';

	const time = `${hour}:${minute} ${meridem}`;
	const at = `${day} @ ${time}`;

	return { day, hour, minute, meridem, time, at }
}

// // gets the ID for an index
// function idToIndex(id) {
// 	const parts = _.map(id.split(':'), _.toNumber);
// 	return (parts[0] * 24 * 4) + (parts[1] * 4) + parts[2];
// }


// // gets the schedule index for an ID
// function indexToId(num) {
// 	const days = Math.floor(num / (24 * 4));
// 	const hours = Math.floor((num - (days * 24)) / 4);
// 	const interval = Math.floor((num - (days * 24) - (hours * 4)));
// 	return `${days}:${hours}:${interval}`;
// }