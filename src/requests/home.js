
import content from '../content';
import $lessons from '../storage/lessons';

export const name = 'home';
export const route = '/';

// determines the correct home view
export async function handle(request, response) {
	const isLoggedIn = !!(request.session && request.session.user);
	
	// show the main screen
	if (isLoggedIn) {
		const { user } = request.session;
		await $lessons.syncLessonAccess(user);

		// update the lessons?
		response.render('app/index');
	}

	// show the home page
	else
		response.render('site/index', { content: content.site });
}