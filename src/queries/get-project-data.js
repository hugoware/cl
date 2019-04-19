import _ from 'lodash';
import log from '../log';
import $database from '../storage/database';
import createLesson from '../actions/create-lesson';
import { getLessonById } from '../storage/lessons/index';

/**
 * gets all project information
 * @param {string} id the ID for the project
 * @returns {object} general project data
 */
export default async function getProjectData(ownerId, id) {
	
	// check for a demo
	if (id === 'demo') {
		const data = getLessonById('demo');
		return _.assign({ }, data, { 
			id: 'demo',
			lesson: 'demo',
			type: 'web'
		});
	}
	
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
				active: 1,
				ownerId: 1,
				modifiedAt: 1,
			})
			.toArray();

		// check for a result
		const project = results[0];
		if (!project)
			return reject('project_not_found');

		// get the general data
		const manifest = getLessonById(project.lesson);
		const { isProject } = manifest;
		// TODO: don't reset projects when opening

		// we don't need to check if the lesson is active
		// since we don't create database entries for
		// placeholder lessons
		// console.log(project);
		
		// if this is a normal project, or the lesson is
		// all done, then just use it normally
		const isLesson = !!project.lesson;
		if (!isLesson || (isLesson && project.done)) {
			delete project.lesson;
			return resolve(project);
		}

		// since this is a lesson, and we aren't trying to
		// track progress across sessions, make sure to reset
		// all file changes and progress
		await createLesson(project.lesson, ownerId);
		
		// give back the project data
		resolve(project);
	})
	.catch(err => {
		log.ex('queries/get-project-data.js', err);
		throw 'server_error';
	});
}
