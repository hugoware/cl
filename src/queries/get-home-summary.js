
import _ from 'lodash';
import $database from '../storage/database';
import $lessons from '../storage/lessons';
import $date from '../utils/date';

/** Handles getting summary information for a user
 * @param {string} id the user ID to find
 */
export default async function get(id) {
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
					active: 1,
					done: 1,
					modifiedAt: 1
				})
				.toArray();

			// sort the projects
			results = $date.sort(results, 'modifiedAt');

			// create public version of the record
			const projects = _.map(results, project => {
				const record = {
					id: project.id,
					type: project.type,
					name: project.name,
					description: project.description,
					modifiedAt: $date.timeAgo(project.modifiedAt),
					lesson: !!project.lesson
				};

				// if this is a lesson, update the state
				if (record.lesson) {
					record.done = project.done;
					record.active = project.active;
					record.sequence = project.sequence;
				}

				return record;
			});

			// make a list of lessons
			const lessons = [ ];
			for (let i = projects.length; i-- > 0;) {
				const project = projects[i];
				if (project.lesson) {
					lessons.push(project);
					projects.splice(i, 1);
				}
			}

			// if there's no lesson yet, and they should have one, unlock
			// one immediately
			// if (lessons.length === 0)
				// results = [ ];

			// create the final summary
			resolve({ 
				user,
				projects,
				lessons
			});
		}
		// failed to get summary
		catch(err) {
			reject(err);
		}

	});
}

// determines the state of a project
function getLessonState(hasLesson, state) {
	return null;
	// return null ? 'new' : 'in-progress' : 'finished';

}