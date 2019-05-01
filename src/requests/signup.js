
export const name = 'sign up';
export const route = '/signup';

import content from '../content';
import Schedule from '../schedule'

// determines the correct home view
export async function handle(request, response) {
	const schedule = Schedule.current.getAvailability();
	response.render('site/signup', { content: content.site, schedule });
}