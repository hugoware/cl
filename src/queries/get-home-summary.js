
import _ from 'lodash';
import $database from '../storage/database';
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
			const query = { ownerId: id };
			let results = await $database.projects.find(query)
				.project({
					_id: 0,
					id: 1,
					name: 1,
					type: 1,
					lesson: 1,
					description: 1,
					state: 1,
					modifiedAt: 1
				})
				.toArray();

			// create public version of the record
			const projects = _.map(results, project => ({
				id: project.id,
				type: project.type,
				name: project.name,
				description: project.description,
				lesson: !!project.lesson,
				state: getLessonState(!!project.lesson, project.state),
				modifiedAt: $date.timeAgo(project.modifiedAt)
			}));

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

			// organize
			_.sortBy(projects, 'modifiedAt');
			_.sortBy(lessons, 'modifiedAt');

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