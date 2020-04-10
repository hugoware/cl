import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';
import editProject from '../actions/edit-project';
import { resolveError } from '../utils';

export const event = 'edit-project';
export const authenticate = true;

export async function handle(socket, session, data = {}) {
  const { user } = session;
  const { id } = data;

  // attach the current user as the owner
  data.ownerId = user;

  try {
    // make sure they can access this project
    const access = await getProjectAccess(id, user);
    if (!access.write) throw 'access_denied';

    const result = await editProject(id, data);
    socket.ok(event, result);
  } catch (err) {
    err = resolveError(err);
    socket.err(event, { err });
  }
}
