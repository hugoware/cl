import log from '../log';
import incrementLessons from '../actions/increment-lessons'

export const name = 'server tasks';
export const route = '/__codelab__/sync';

// determines the correct home view
export async function handle(request, response) {
	try {
		const result = await incrementLessons();
		response.send(result);
	}
	// failed to sync
	catch (err) {
		log.ex('requests/sync.js', err);
		response.send('server_error');
	}
}