import $fsx from 'fs-extra';
import $path from './path';

// writes an audit log message
export async function log(event, userId, data) {
	const path = $path.resolveLog();
	const line = [ event, +new Date, userId, JSON.stringify(data || { })].join('\t') + '\n';
	await $fsx.appendFile(path, line);
}

export default {
	log
};