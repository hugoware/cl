
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** sets the state of a project to removed
 * @param {string} id the project ID to find
 */
export default async function removeProject(id) {
	return $database.projects.update({ id }, {
		$set: {
			removed: true,
			modifiedAt: $date.now()
		}
	});
}
