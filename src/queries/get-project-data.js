
import log from '../log';
import $database from '../storage/database';
import createLesson from '../actions/create-lesson';

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @returns {object} general project data
 */
export default async function getProjectData(ownerId, id) {
	return new Promise(async (resolve, reject) => {
		const results = await $database.projects.find({ id })
			.project({
				_id: 0,
				id: 1,
				type: 1,
				name: 1,
				description: 1,
				lesson: 1,
				done: 1,
				finished: 1,
				active: 1,
				ownerId: 1,
				modifiedAt: 1,
			})
			.toArray();

		// check for a result
		const project = results[0];
		if (!project)
			return reject('project_not_found');

		// if this is a lesson, but it's not active, then
		// we need to reject the request - this could happen
		// if someone knows to type in the project URL
		const isLesson = !!project.lesson;
		if (isLesson && !project.active)
			return reject('lesson_not_active');

		// if this is a normal project, or the lesson is
		// all done, then just use it normally
		if (!isLesson || (isLesson && project.done)) {
			delete project.lesson;
			return resolve(project);
		}

		// since this is a lesson, and we aren't trying to
		// track progress across sessions, make sure to reset
		// all file changes and progress
		const result = await createLesson(project.lesson, ownerId);
		console.log(result);
		
		// give back the project data
		resolve(project);
	})
	.catch(err => {
		log.ex('queries/get-project-data.js', err);
		throw 'server_error';
	});
}
