
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** Handles getting summary information for a user
 * @param {string} id the user ID to find
 * @param {object} progress information about the progress of the lesson
 */
export default async function setProgress(id, progress) {
	return $database.projects.update({ id }, {
		$set: { 
			progress,
			modifiedAt: $date.now(),
		}
	});
}
