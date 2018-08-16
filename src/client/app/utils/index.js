import _ from 'lodash';
import $lfs from '../lfs';

/** cancels an even from firing any further
 * @param {JQuery.Event} event the event to cancel
 */
export function cancelEvent(event) {
	if (_.isFunction(event.stopImmediatePropagation))
		event.stopImmediatePropagation();

	if (_.isFunction(event.stopPropagation))
		event.stopPropagation();

	if (_.isFunction(event.preventDefault))
		event.preventDefault();

	event.cancelBubble = true;
	return false;
}

/** gets the extension from a filename 
 * @param {string} path the path or file to extract from
 * @param {object} options configuration options
 * @param {boolean} options.removeLeadingDot allows the starting dot to be removed
*/
export function getExtension(path, { removeLeadingDot } = { }) {
	path = _.trim(path).toLowerCase().match(/\.[^\.]*$/)[0];

	if (removeLeadingDot)
		path = path.replace(/^\.?/, '');

	return path;
}

/** returns the directory and file name of a path
 * @param {string} path the path or file to extract from
 * @returns {{ directory: string, file: string }} 
*/
export function getPathInfo(path, { removeTrailingSlash } = { }) {

	// match at the final slash -- if it's already just the file
	// name (no slashes, then use the path as is)
	let file = _.trim(path).toLowerCase().match(/\/[^\/]*$/);
	file = _.some(file) ? file[0] : path;
	file = file.replace(/^\/?/, '');
	
	let directory = path.substr(0, path.length - file.length);
	if (directory || removeTrailingSlash)
		directory = directory.replace(/\/*$/g, '');

	// if nothing is there, it's the root directory
	if (!_.some(directory)) directory = '/';
	return { directory, file };
}

/** gets the name and extension for a file
 * @param {string} fileName the name of the file
 * @returns {{ name: string, ext: string }}
 */
export function getFileInfo(fileName) {
	const extension = getExtension(fileName, true);
	const name = fileName.substr(0, fileName.length - extension.length);
	return { name, extension };
}

/** extracts a file path from a url
 * @param {string} url the url to extract from
 * @returns {string} the file path found
 */
export function resolvePathFromUrl(path) {
	path = _.trim(_.trim(path).split('?')[0]);
	
	// removes a leading dot if it's not followed by a slash
	if (path[0] === '.' && path[1] !== '/') path = path.substr(1);
	return $lfs.normalizePath(path);
}
