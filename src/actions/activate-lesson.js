
import $lessons from '../storage/lessons'

// handles activating a project and giving back the ID
export default async function activateLesson(id, user) {
	const lesson = $lessons.getLessonById(id);
	return await $lessons.initLesson(lesson, user);
}