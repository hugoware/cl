
import _ from 'lodash';
import $database from '../storage/database';

/** Handles getting summary information for a user
 * @param {string} id the user ID to find
 */
export default async function get(id) {
	return new Promise(async (resolve, reject) => {
		try {
		
			// get the user information
			const users = await $database.users.find({ id })
				.project({
					first: 1,
					progress: 1
				})
				.toArray();

			// get the user
			const user = _.size(users) === 1 && users[0];
			if (!user) 
				return reject('user_error');

			// find all of the user projects
			const query = { ownerId: id };
			const projects = await $database.projects.find(query)
				.project({
					_id: 0,
					id: 1,
					name: 1,
					type: 1,
					lesson: 1,
					description: 1,
					modifiedAt: 1
				})
				.toArray();

			// create the final summary
			return { projects };
		}
		// failed to get summary
		catch(err) {
			reject(err);
		}

	});
}

// core:
// 	core_1
// 	core_2
// 	core_3

// web:
// 	web_1
// 	web_2
// 	web_3
// 	web_4
// 	web_5
// 	web_6

