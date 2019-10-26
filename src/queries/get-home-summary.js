
import _ from 'lodash';
import $database from '../storage/database';
import $lessons from '../storage/lessons';
import $date from '../utils/date';
import $moment from 'moment';

/** Handles getting summary information for a user
 * @param {string} id the user ID to find
 */
export default async function get(id, isClassroom) {
	return new Promise(async (resolve, reject) => {
		try {
			
			// get the user info
			const users = await $database.users.find({ id })
				.project({
					_id: 0,
					first: 1,
					avatar: 1,
					progress: 1
				})
				.toArray();

			// check for the user
			const user = users.length === 1 && users[0];
			if (!user)
				return reject('user_not_found');

			// find all of the user projects
			const query = { ownerId: id, removed: { $not: { $eq: true } } };
			let results = await $database.projects.find(query)
				.project({
					_id: 0,
					id: 1,
					name: 1,
					type: 1,
					lesson: 1,
					description: 1,
					sequence: 1,
					modifiedAt: 1,

					// has it been finished before
					completed: 1,

					// is it currently done
					done: 1,
				})
				.toArray();

			// order in sequence
			results = _.sortBy(results, result => $moment(result.modifiedAt).valueOf());
			results.reverse();

			// adjust categories
			const projects = [ ];
			const lessons = [ ];
			_.each(results, item => {
				const target = item.lesson ? lessons : projects;
				const record = {
					id: item.id,
					type: item.type,
					name: item.name,
					description: item.description,
					modifiedAt: $date.timeAgo(item.modifiedAt),
				};

				// adjust for lessons
				if (item.lesson) {
					record.sequence = item.sequence;
					record.lesson = item.lesson;
					record.completed = !!item.completed;
					record.done = !!item.done;
				}

				target.push(record);
			})

			// setup the results
			const result = { user, projects };

			// for lessons, capture data
			const allowUnlock = true; // !!isClassroom;
			const state = $lessons.getLessonState(id, lessons, allowUnlock);
			_.assign(result, state, { isClassroom });

			// give back the results
			resolve(result);
		}
		// failed to get summary
		catch(err) {
			reject(err);
		}

	});
}
