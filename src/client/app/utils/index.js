import _ from 'lodash';
import $lfs from '../lfs';
import $state from '../state'

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

/** returns detail about what a selection contains
 * @param {ProjectItem[]} items a list of items to check
 * @returns {SelectionInfo}
 */
export function getSelectionType(items, expand) {

	// extract the layers
	items = _(items)
		.map(item => 
			_.isString(item) ? $state.findItemByPath(item)
				: 'data' in item ? item.data
				: 'id' in item ? item
				: null
			)
		.compact()
		.value();

	// should this include the complete set of items
	if (expand)
		items = expandPaths(_.map(items, item => item.path));

	// update styling as requires
	const totalCount = _.size(items);
	const isMultiple = _.size(items) > 1;
	const isNothing = _.size(items) === 0;
	const files = _.map(items, item => item.isFile);
	const folders = _.map(items, item => item.isFolder);
	const fileCount = _.size(files);
	const folderCount = _.size(folders);
	const onlyFiles = fileCount > 0 && fileCount === totalCount;
	const onlyFolders = folderCount > 0 && folderCount === totalCount;
	const isMixed = !(onlyFiles || onlyFolders);
	let displayName = onlyFiles ? 'File'
		: onlyFolders ? 'Folder'
			: 'Item';

	// plural selection
	if (isMultiple)
		displayName += 's';

	return { 
		displayName,
		isMultiple, isMixed, isNothing,
		files, fileCount, onlyFiles, 
		folders, folderCount, onlyFolders
	};
}


/** expands a path to include all children
 * @param {string} path
 * @returns {ProjectItem[]}
 */
export function expandPaths(paths, expanded = []) {
	for (const path of paths) {

		// add the item first
		const item = $state.findItemByPath(path.path || path);
		expanded.push(item);

		// if this is a folder, include the children
		if (item.isFolder)
			expandPaths(item.children, expanded);
	}

	return expanded;
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
