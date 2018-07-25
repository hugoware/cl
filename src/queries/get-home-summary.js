
import $database from '../storage/database';

/** Handles getting summary information for a user
 * @param {string} id the user ID to find
 */
export default async function get(id) {

	// find all of the user projects
	const query = { ownerId: id };
	const projects = await $database.projects.find(query)
		.project({
			_id: 0,
			id: 1,
			name: 1,
			type: 1,
			description: 1,
			modifiedAt: 1
		})
		.toArray();

	// create the final summary
	return { projects };
}