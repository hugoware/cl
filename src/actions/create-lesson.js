
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

		// check if this needs to be created again or not
		const query = { lesson: lessonId, ownerId: userId };
		const lessons = await $database.projects.find(query)
			.project({ _id: 0, id: 1 })
			.toArray();

		// no lessons means we need to create it
		let id;
		if (lessons.length === 0) {
			throw 'invalid_lesson_state';
			
			// // get the project data
			// let lesson = resolveLesson(lessonId, 'data.json');
			// lesson = await $fsx.readFile(lesson);
			// lesson = JSON.parse(lesson.toString());

			// // try and create the record
			// id = await $database.generateId($database.projects, 6);
			
			// // get the default information
			// const { name, type, description } = lesson;
			// await $database.projects.insertOne({
			// 	id, name, type, description,
			// 	lesson: lessonId,
			// 	ownerId: userId,
			// 	done: false,
			// 	active: true,
			// 	modifiedAt: $date.now()
			// });
		}
		// otherwise, we can just replace the state
		else if (lessons.length === 1) {
			id = lessons[0].id;
			await $database.projects.update(query, {
				$set: { 
					done: false,
					modifiedAt: $date.now()
				}
			});
		}
		// not sure
		else {
			return reject('invalid_lesson');
		}

		// get the resources to copy
		try {
			const source = resolveLesson(lessonId, 'files');
			const target = resolveProject(id);
			
			// remove the old files
			const exists = await $fsx.exists(target);
			if (exists) await $fsx.remove(target);
			
			// copy the files
			await $fsx.copy(source, target);
			
			// all done
			resolve({ success: true });
		}
		// something went wrong
		catch (err) {
			reject(err);
		}

	});

}