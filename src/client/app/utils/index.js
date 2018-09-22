import _ from 'lodash';
import $randomcolor from 'randomcolor';
import $lfs from '../lfs';
import $state from '../state'
import $url from 'url';

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
export function getSelectionInfo(items, getExpandedView = true) {

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
	if (getExpandedView)
		items = expandPaths(items);

	// just in case
	items = _(items)
		.compact()
		.uniqBy('path')
		.value();

	// update styling as requires
	const totalCount = _.size(items);
	const isMultiple = totalCount > 1;
	const isNothing = totalCount === 0;
	const files = _.filter(items, item => item.isFile);
	const folders = _.filter(items, item => item.isFolder);
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

	const displayNameWithCount = `${isMultiple ? totalCount : ''} ${displayName}`;

	return { 
		displayName, displayNameWithCount,
		isMultiple, isMixed, isNothing,
		files, fileCount, onlyFiles, 
		folders, folderCount, onlyFolders,
		items, totalCount
	};
}


/** expands a path to include all children
 * @param {string} path
 * @returns {ProjectItem[]}
 */
export function expandPaths(paths, expanded = []) {
	// check each path in this collection
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
export function resolvePathFromUrl(path, relativeTo) {
	path = $url.resolve(relativeTo + '/', path);
	return $lfs.normalizePath(path);
}

/** creates a hash from a string value 
 * @param {string} str the string to create the hash from
 * @returns {number} the final hash
*/
export function hashString(str) {
	str = (str || '').toString()
	var hash = 0, i, chr;
	if (str.length === 0) return hash;
	for (i = 0; i < str.length; i++) {
		chr = str.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};

/** creates a random color
 * @param {number} [basedOn] provide an optional known value
 * @return {string} the resulting color
 */
export function randomColor(basedOn = Math.random()) {
	return `#${(basedOn * 0xFFFFFF << 0).toString(16)}`;
}

/** creates a semi-random color based on a string
 * @param {string} str the string value to base the color on
 * @returns {string} the color to use
 */
export function semiRandomColor(str) {
	const seed = Math.abs(hashString(str));
	return $randomcolor({ seed, format: 'hex' });
}