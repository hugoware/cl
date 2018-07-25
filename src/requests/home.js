
export const name = 'home';
export const route = '/';

// determines the correct home view
export function handle(request, response) {
	const isLoggedIn = !!(request.session && request.session.user);
	response.render(isLoggedIn ? 'app/index' :'site/home');
}