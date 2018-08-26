import { resolveError } from '../utils';
import $path from '../path';
import $fsx from 'fs-extra';
import getProjectAccess, { ProjectAccess } from '../queries/get-project-access';

export const name = 'upload file';
export const route = '/__codelab__/upload';
export const method = 'post';
export const authenticate = true;
export const acceptForm = true;

// max file size -- might change depending
// on project and user
const MAX_FILE_SIZE_KB = 1024 * 1024 * 10;

// determines the correct home view
export async function handle(request, response) {
	const { session } = request;
	const { user } = session;

	try {
		// get each part of required data
		const { form } = request;
		if (form.error)
			throw form.error;

		// get the form data
		console.log('wat', form);
		const path = form.get('fields.path[0]');
		const projectId = form.get('fields.projectId[0]');
		const file = form.get('files.file[0]');

		// make sure they can access this project
		const access = await getProjectAccess(projectId, user);
		if (!access.write) {
			response.status(403);
			return response.send('file_upload_not_allowed');
		};

		// make sure a file was provided
		if (!file) {
			response.status(406);
			return response.send('file_upload_missing');
		}
			
		// perform some server validation
		if (file.size > MAX_FILE_SIZE_KB) {
			response.status(413);
			return response.send('file_upload_too_large');
		}

		// check the file type
		// if (isAllowedType()) {
		// 	response.status(400);
		// 	response.send('file_upload_invalid_type');
		// 	return;
		// }

		// get the path to write to
		const target = $path.resolveProject(projectId, path);
		if (!target) {
			response.status();
			return response.send('file_upload_invalid_path');
		}

		// since it's good to go, write the content
		await $fsx.move(file.path, target, { overwrite: true });

		// ready to go
		response.status(200);
		response.send('ok');

	}
	catch (err) {
		resolveError(err, 'requests/upload-file.js');
		response.status(500);
		response.send('file_upload_error');
	}

}