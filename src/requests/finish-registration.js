import { parse } from 'url';
import syncSubscription from '../actions/sync-subscription'
import audit from '../audit'

export const name = 'finish registration';
export const route = '/thankyou';

export async function handle(request, response) {

	// get the ID to use
	const parsed = parse(request.url);
	const subscriptionId = parsed.query;

	// attempt to sync the request
	let result;
	try {
		result = await syncSubscription(subscriptionId);
	}
	catch (ex) {
		audit.log('register', 'anonymous', ex);
		result = { status: 'server_error' };

		// error code
		response.status(500);
	}
	finally {

		// request was missing
		if (result.status === 'missing')
			response.status(404);

		// show the result
		response.render('site/thankyou', { result });
	}

}