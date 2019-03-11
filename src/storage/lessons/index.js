import _ from 'lodash';

import $fsx from 'fs-extra';
import $path from '../../path';
import $database from '../database';
import LessonTemplate from './template';
import $date from '../../utils/date';
import $yaml from 'js-yaml';


// map of all lessons to load
const $lessons = { };
let $sequence;

// handles initializing the lesson repo
async function init() {
	console.log('[lessons] parsing lesson data');

	// read in the content
	const path = $path.resolveResource('lessons.yml');
	const content = $fsx.readFileSync(path);
	$sequence = $yaml.load(content.toString());

	// load each lesson type
	_.each($sequence, (lessons, category) => {
		const group = $lessons[category] = { };
		_.each(lessons, lesson => {
			group[lesson] = new LessonTemplate(lesson);
		});
	});

}


// returns a list of available lessons
export function getLessonState(userId, lessons, allowUnlock) {

	// check if this needs to be created again or not
	const result = { lessons };

	// process each category
	for (const category in $lessons)
		evaluateLessonCategory(category, result, allowUnlock);

	return result;
}

// try to determine what they have access to
function evaluateLessonCategory(category, result, allowUnlock) {
	const source = $lessons[category];
	
	// limit the categories
	const lessons = _.filter(result.lessons, { type: category });
	const allowed = _($sequence[category])
		.filter(id => !_.find(lessons, { lesson: id }))
		.value();

	// if all lessons are 'completed' then the next lesson
	// should be displayed as a placeholder
	const active = _.reject(lessons, { completed: true });
	const noLessons = !_.some(lessons);
	const noActive = !_.some(active);
	if ((noActive && allowUnlock) || noLessons) {
		const start = allowed.shift();
		const lesson = source[start];
		const placeholder = createLessonPlaceholder(lesson);
		result.lessons.push(placeholder);
	}

	// when allowing unlocks, also show the next lesson
	if (!!allowUnlock) {

		// display a preview item
		const preview = allowed.shift();
		if (preview) {
			const lesson = source[preview];
			const placeholder = createLessonPlaceholder(lesson);
			placeholder.isPreview = true;
			result.lessons.push(placeholder);
		}
	}

	// save to the list
	result[`is${_.capitalize(category)}Done`] = _.some(allowed);
}

// creates a placeholder for a lesson
function createLessonPlaceholder(lesson) {
	const { name, type, description } = lesson;
	return {
		name, type, description,
		lesson: lesson.id,
		sequence: +new Date,
	}
}


// creates a new record placeholder for a lesson
export function initLesson(lesson, userId) {
	return new Promise(async resolve => {

		// no lesson was provided
		if (!lesson) 
			return resolve({ success: false });
		
		// create the ID to use first
		const id = await $database.generateId($database.projects, 6);
		
		// get the default information
		const { name, type, description } = lesson;
		await $database.projects.insertOne({
			id, name, type, description,
			lesson: lesson.id,
			ownerId: userId,
			modifiedAt: $date.now(),
			
			// order of creation to make sure
			// that the listing order stays the same
			sequence: +new Date
		});
		
		resolve({ id, success: true });
	});
}


/** finds a lesson by its id */
export function getLessonById(id) {
	for (const category in $lessons) {
		const lesson = $lessons[category][id];
		if (lesson) return lesson;
	}
}


export default {
	init,
	getLessonById,
	getLessonState,
	initLesson
};