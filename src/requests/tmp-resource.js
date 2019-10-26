import _ from 'lodash';
import $path from '../path';
import $fsx from 'fs-extra';

export const name = 'temp resource';
export const route = '/__codelab__/tmp/*';
export const authenticate = true;

export async function handle(request, response) {
	const key = _.get(request.params, '[0]');
	const abs = $path.getTempPath(key);
	const exists = await $fsx.exists(abs);

	return exists ? response.sendFile(abs)
		: response.send('404');
}