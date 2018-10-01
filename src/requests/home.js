
import content from '../content';

export const name = 'home';
export const route = '/';

// determines the correct home view
export function handle(request, response) {
	const isLoggedIn = !!(request.session && request.session.user);
	
	// show the main screen
	if (isLoggedIn)
		response.render('app/index');

	// show the home page
	else
		response.render('site/index', { content: content.site });
}