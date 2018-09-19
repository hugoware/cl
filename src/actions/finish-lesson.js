
import _ from 'lodash';
import $database from '../storage/database';
import $date from '../utils/date';

/** Handles finishing a lesson
 * @param {string} id the projectID ID to find
 * @param {object} progress information about the progress of the lesson
 */
export default async function finishLesson(id) {
	return $database.projects.update({ id }, {
		$set: { 
			progress: null,
			finished: true,
			modifiedAt: $date.now(),
		}
	});
}
