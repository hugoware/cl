import _ from 'lodash';
import chargebee from 'chargebee';

import $config from '../config';
import $database from '../storage/database';

import Schedule from '../schedule'
import audit from '../audit'

export default function syncSubscription(subscriptionId) {
	return new Promise(async (resolve, reject) => {

		// no ID was provided
		if (!_.some(subscriptionId))
			return resolve({ success: false, status: 'missing_id' });

		// if this is existing, then just update it
		const existing = await $database.users
			.find({ subscriptionId }, { _id: 1, subscriptionId: 1, timeSlot: 1 }).limit(1)
			.toArray();

		// if this already exists, then the subscription is
		// in the system and can be ignored
		if (_.some(existing)) {
			const record = existing[0];
			const session = Schedule.current.getSession(record.timeSlot);
			return resolve({
				success: false,
				status: 'already_registered',
				subscriptionId: record.subscriptionId,
				date: session.at
			});
		}
		
		// setup access
		chargebee.configure({
			site: $config.chargebeeApiTarget,
			api_key: $config.chargebeeApiKey
		});

		// check if this is a real subscription
		chargebee.subscription.retrieve(subscriptionId)
			.request(async (error, result) => {

				// failed for another reason
				if (error) {

					// all other errors
					if (error.http_status_code === 404) {
						return resolve({ status: 'missing' });
					}
					// log all other errors
					else {
						const data = Object.assign({ subscriptionId, error });
						audit.log('register', 'anonymous', data);
						return resolve({ status: 'server_error' });
					}
				}

				// add the new record
				const first = result.subscription.cf_students_first_name;
				const last = result.subscription.cf_students_last_name;
				const sessionId = result.subscription.cf_session_id;
				const id = await $database.generateId($database.users, 10);

				// add this user to the database
				await $database.users.insertOne({
					id,
					first,
					last,

					// enrollment
					timeSlot: sessionId,
					subscriptionId,

					// locale?
					domain: 'codelab-irving',
					type: 'student'
				});

				// update the schedule (so it doesn't have to reload)
				const index = 0 | sessionId;
				const session = Schedule.current.getSession(index);
				Schedule.current.reserveSlot(index);

				// console.log(result);
				resolve({
					success: true,
					first,
					last,
					subscriptionId,
					date: session.at,
				});
				

			});

	});
}
