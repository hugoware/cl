
export const name = 'showcase';
export const route = '/showcase';

import content from '../content';

// determines the correct home view
export function handle(request, response) {
	response.render('site/showcase', { showcase: content.showcase });
}