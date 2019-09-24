
export const name = 'sign up (tutoring)';
export const route = '/tutoring';

import content from '../content';
import $config from '../config';

// determines the correct home view
export function handle(request, response) {

	response.render('site/tutoring', {
		content: content.site,
		billingTarget: $config.chargebeeApiTarget
	});
}