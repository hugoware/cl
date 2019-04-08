
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';
import removeProject from '../actions/remove-project';
import { resolveError } from '../utils';
import audit from '../audit';

export const event = 'remove-project';
export const authenticate = true;

export async function handle(socket, session, data = { }) {
	const { user } = session;
	const { id } = data;

	try {
		// make sure they can access this project
		const access = await getProjectAccess(id, user);
		if (!access.write) {
			audit.log('remove-project', user, { projectId: id, denied: 'no_write_access' });
			throw 'access_denied';
		}
		
		await removeProject(id);
		audit.log('remove-project', user, { projectId: id });
		socket.ok(event, { success: true });
	}
	catch (err) {
		err = resolveError(err);
		socket.err(event, { err });
	}
}