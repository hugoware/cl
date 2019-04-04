
import _ from 'lodash';
import $database from '../storage/database';
import $lessons from '../storage/lessons';
import $date from '../utils/date';

/** Handles finishing a lesson
 * @param {string} userId the user id of the account
 * @param {string} id the projectID ID to find
 * @param {object} progress information about the progress of the lesson
 */
export default async function finishLesson(userId, id) {
	if (id === 'demo') return;
	
	await $database.projects.update({ id }, {
		$set: { 
			done: true,
			completed: true,
			modifiedAt: $date.now(),
		}
	});
}
