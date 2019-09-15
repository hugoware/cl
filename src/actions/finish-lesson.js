
import _ from 'lodash';
import $database from '../storage/database';
import $lessons from '../storage/lessons';
import $date from '../utils/date';
import $config from '../config';

/** Handles finishing a lesson
 * @param {string} userId the user id of the account
 * @param {string} id the projectID ID to find
 * @param {object} progress information about the progress of the lesson
 */
export default async function finishLesson(userId, id) {

	// no finishing of demo projects
	if (_.includes($config.DEMO_PROJECTS, id))
		return;
	
	await $database.projects.update({ id }, {
		$set: { 
			done: true,
			completed: true,
			modifiedAt: $date.now(),
		}
	});
}
