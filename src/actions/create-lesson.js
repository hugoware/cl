
import _ from 'lodash';
import $fsx from 'fs-extra';
import $database from '../storage/database';
import $date from '../utils/date';
import { resolveLesson, resolveProject } from '../path';

/** handles creating a lesson project -- will overwrite an existing project if an ID is provided
 * @param {string} lessonId the lesson to create
 * @param {string} userId the user id that this belongs to
 */
export default async function createLesson(lessonId, userId) {
	return new Promise(async (resolve, reject) => {
			
		// get the project data
		let lesson = resolveLesson(lessonId, 'data.json');
		lesson = await $fsx.readFile(lesson);
		lesson = JSON.parse(lesson.toString());

		// check if this needs to be created again or not
		const query = { lesson: lessonId, ownerId: userId };
		const lessons = await $database.projects.find(query)
			.project({ id: 1 })
			.toArray();

		// no lessons means we need to create it
		let id;
		if (lessons.length === 0) {
			// try and create the record
			id = await $database.generateId($database.projects, 6);
			
			const { name, type, description } = lesson;
			await $database.projects.insertOne({
				id, name, type, description,
				lesson: lessonId,
				ownerId: userId,
				modifiedAt: $date.now(),
				state: { }
			});
		}
		// otherwise, we can just replace the state
		else {
			await $database.projects.update(query, {
				$set: { state: { } }
			});
		}
		
		// get the resources to copy
		const source = resolveLesson(lessonId, 'resources');
		const target = resolveProject(id);

		// remove the old files
		const exists = await $fsx.exists(target);
		if (exists) await $fsx.remove(target);
		
		// copy the files
		await $fsx.copy(source, target);

		// all done
		resolve();
	});

}