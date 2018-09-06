
import _ from 'lodash';
import $fsx from 'fs-extra';
import $database from '../storage/database';
import { resolveLesson } from '../path';
import createLesson from './create-lesson'

// seven days per unlock
const DEFAULT_UNLOCK_INVERVAL = 7;

/** updates lesson progress for all users */
export default async function incrementLessons() {

	await createLesson('web_basics_1', 'hugo');

	return;
	return new Promise(async (resolve, reject) => {
		try {

			// get a list of courses first
			const lessons = resolveLesson();
			const available = await $fsx.readdir(lessons);
		
			// track the number of unlocked lessons
			let unlocked = 0;

			// get all users in the database
			const users = await $database.users.find({ 
					// only find active users?
				})
				.project({
					id: 1,
					progress: 1,
					unlockInterval: 1
				})
				.toArray();

			// start updating each record
			for (const user of users) {
				const { id, progress, interval = DEFAULT_UNLOCK_INVERVAL } = user;

				// check the current date
				if (isNaN(progress.next))
					progress.next = 0;

				// increment downward
				progress.next--;

				// check if something new was unlocked
				if (progress.next <= 0) {
					progress.next = interval;
					unlocked++;

					// increment progress
					const { track = 'core' } = progress;
					progress[track] = progress[track] || 0; 
					progress[track]++;

					// after tracking the progress, check that this
					// is really a course available
					const course = `${track}_${progress[track]}`;
					const exists = _.includes(available, course);

					// create the new lesson
					if (exists)
						await createLesson(course, id);

				}

				// save the unlock
				await $database.users.update({ id }, {
					$set: { progress }
				});
			}

			// all finished
			resolve({ updated: users.length, unlocked });
		}
		// this is critical -- should send alerts
		catch(err) {
			reject(err);
		}
	});

}