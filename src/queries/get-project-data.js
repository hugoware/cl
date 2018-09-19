
import $fsx from 'fs-extra';
import log from '../log';
import $database from '../storage/database';
import { resolveLesson } from '../path';

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @returns {object} general project data
 */
export default async function getProjectData(id) {
	return new Promise(async (resolve, reject) => {
		const results = await $database.projects.find({ id })
			.project({
				_id: 0,
				id: 1,
				type: 1,
				name: 1,
				description: 1,
				lesson: 1,
				progress: 1,
				ownerId: 1,
				modifiedAt: 1,
				finished: 1,
			})
			.toArray();

		// check for a result
		const project = results[0];
		if (!project)
			return reject('project_not_found');

		// verify this is a real lesson
		if (project.lesson) {
			const path = resolveLesson(project.lesson)
			const exists = await $fsx.exists(path);
			
			// remove lesson info if the lesson no longer exists
			if (!exists) {
				delete project.lesson;
				delete project.progress;
			}
		}

		resolve(project);
	})
	.catch(err => {
		log.ex('queries/get-project-data.js', err);
		throw 'server_error';
	});
}
