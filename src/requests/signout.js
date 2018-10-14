import _ from 'lodash';

export const name = 'home';
export const method = 'post';
export const route = '/signout';

// determines the correct home view
export function handle(request, response) {

	// clear the session
	if ('session' in request && _.isFunction(request.session.destroy))
		request.session.destroy();

	// notify this worked
	return request.xhr
		? response.json({ success: true })
		: response.redirect('/');
}