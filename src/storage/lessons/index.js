import _ from 'lodash';

import { watch } from 'fs';
import $fsx from 'fs-extra';
import $config from '../../config';
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
	reload();

	// watch for lesson changes
	const path = $path.resolveRoot($config.lessonManifest);
	console.log('watching', path);
	watch(path, () => {
		if (!_.endsWith(path, '/index.yml')) return;
		console.log('[lessons] reloading lesson data');
		reload();
	});

}


// handles reloading content
function reload() {
	// remove existing
	for (let k in $lessons)
		delete $lessons[k];

	// read in the content
	const location = `${$config.lessonManifest}/index.yml`;
	const path = $path.resolveRoot(location);
	const content = $fsx.readFileSync(path);
	$sequence = $yaml.load(content.toString());

	// load each lesson type
	_.each($sequence, (lessons, category) => {
		let group = $lessons[category] = {};
		_.each(lessons, lesson => {
			
			// special lesson
			if (lesson === 'demo')
				group = $lessons.sys = { };

			// save the template
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

		// create the next lesson
		const lesson = source[start];
		if (lesson) {	
			const placeholder = createLessonPlaceholder(lesson);
			result.lessons.push(placeholder);
		}
		// no more lessons to unlock
		else markAtEnd(result, category);
	}

	// when allowing unlocks, also show the next lesson
	if (!!allowUnlock) {

		// display a preview item
		const preview = allowed.shift();
		if (preview) {
			const lesson = source[preview];
			if (lesson) {	
				const placeholder = createLessonPlaceholder(lesson);
				placeholder.isPreview = true;
				result.lessons.push(placeholder);
			}
			// no more lessons to unlock
			else markAtEnd(result, category);
		}
	}
}

// mark as finished
function markAtEnd(result, category) {
	// result[`is${_.capitalize(category)}Done`] = true;
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