
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';
import setProgress from '../actions/set-progress';
import { resolveError } from '../utils';

export const event = 'set-progress';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const { user } = session;
	const { projectId, progress } = data;

	console.log("DONT FORGET");
	return socket.ok(event, { success: true });

	try {
		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write)
			throw 'access_denied';

		await setProgress(projectId, progress);
		socket.ok(event, { success: true });
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}