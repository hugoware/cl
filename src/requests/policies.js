
export const name = 'policies';
export const route = '/policies';

import content from '../content';

// determines the correct home view
export function handle(request, response) {
	response.render('site/policies', { content: content.site });
}