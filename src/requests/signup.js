
export const name = 'sign up';
export const route = '/signup';

import content from '../content';
import Schedule from '../schedule'
import $config from '../config';

// determines the correct home view
export function handle(request, response) {

	// create the start date -- for now July 1
	const start = new Date();
	start.setMonth(7);
	start.setDate(21);
	start.setFullYear(2019);
	const now = new Date();
	const isPreEnroll = +start > +now;

	const schedule = Schedule.getAvailability();

	response.render('site/signup', {
		content: content.site,
		schedule,
		isPreEnroll,
		billingTarget: $config.chargebeeApiTarget
	});
}