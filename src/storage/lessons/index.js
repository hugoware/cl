import _ from 'lodash';

import $fsx from 'fs-extra';
import $path from '../../path';
import $database from '../database';
import LessonTemplate from './template';
import $date from '../../utils/date';
import $yaml from 'js-yaml';

// map of all lessons to load
const $lessons = { };
let $lessonIds;


// handles initializing the lesson repo
async function init() {
	console.log('[lessons] parsing lesson data');

	// read in the content
	const path = $path.resolveRoot('lessons.yml');
	const content = $fsx.readFileSync(path);
	$lessonIds = $yaml.load(content.toString());

	// load each lesson type
	_.each($lessonIds, (lessons, category) => {
		const group = $lessons[category] = { };
		_.each(lessons, lesson => {
			group[lesson] = new LessonTemplate(lesson);
		});
	});

}


/** syncs a user profile and lesson progress */
async function syncLessonAccess(userId) {

	// check if this needs to be created again or not
	const query = { ownerId: userId, lesson: { $exists: true } };
	const lessons = await $database.projects.find(query)
		.project({ _id: 0, id: 1, type: 1, lesson: 1, done: 1, active: 1 })
		.toArray();

	// check each of the categories
	for (const category in $lessons)
		await evaluateLessonCategory(userId, category, lessons);

}

async function evaluateLessonCategory(userId, category, existing) {
	const all = _.filter(existing, { type: category });
	const ids = _.map(all, 'lesson');
	const roadmap = _.difference($lessonIds[category], ids);
	const current = _.filter(all, 'active');
	const unfinished = _.reject(current, 'done');
	const hasUnfinished = _.some(unfinished);

	// check for a pending, non-active lesson
	let pending = _.reject(all, 'active');
	let hasPending = _.some(pending);

	// if all of the lessons have been finished, then 
	// we need to activate whatever pending lesson is
	// found (if any)
	if (!hasUnfinished) {

		// if there's an existing pending lesson, just activate it
		if (hasPending) {
			await activateLesson(pending);
		}
		// since there's not a pending lesson then we
		// need to grab the next one on the list
		// and create it now
		else {
			const lesson = getNext(category, roadmap);
			await createLesson(userId, lesson, { active: true });
		}
		
	}
	// there's unfinished lessons - we just need to
	// check and see if they have a queued up lesson
	else if (!hasPending) {
		const lesson = getNext(category, roadmap);
		await createLesson(userId, lesson);
	}
}

/** creates a brand new record id */
async function createLesson(userId, lesson, active) {
	
	// no lesson was provided
	if (!lesson) return;

	// create the ID to use first
	const id = await $database.generateId($database.projects, 6);
	
	// get the default information
	const { name, type, description } = lesson;
	await $database.projects.insertOne({
		id, name, type, description,
		lesson: lesson.id,
		ownerId: userId,
		done: false,
		active: !!active,
		modifiedAt: $date.now(),

		// order of creation to make sure
		// that the listing order stays the same
		sequence: +new Date
	});

}


// toggles a lesson as active
async function activateLesson(lessons) {
	lessons = _.isArray(lessons) ? lessons : [lessons];
	for (let i = 0; i < lessons.length; i++) {
		const lesson = lessons[i];
		const { id } = lesson;
		console.log('activated', id);
		// await $database.projects.update({ id }, { active: true });
	}
}


// gets the next lesson in a category
function getNext(category, roadmap) {
	const next = roadmap.shift();
	if (!next) return;
	return $lessons[category][next];
}


export default {
	init,
	syncLessonAccess
};