
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** handles updating the progress for a lesson
 * @param {string} id the project ID to find
 * @param {object} progress information about the progress of the lesson
 */
export default async function setProgress(id, progress) {
	return $database.projects.update({ id }, {
		$set: { 
			progress,
			started: true,
			modifiedAt: $date.now(),
		}
	});
}
