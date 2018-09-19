import _ from 'lodash';

/** file types that display in the code editor */
export const TEXT_FILE_TYPES = [
	
	// styling
	'css', 'scss', 'sass',
	
	// programming languages
	'js', 'jsx',
	'rb', 'cs', 'vs', 'py', 'ts',

	// database languages
	'sql', 'sq',

	// markup
	'html', 'htm', 'pug', 'jade', 'md',

	// others
	'txt'
];

/** checks if the expected file content is actually text 
 * @param {string} path the path of the file
 * @returns {boolean} returns if this file has text content
*/
export function isTextContent(path) {
	const parts = ((path || '').replace(/ */g, '')).toLowerCase().split(/\./g);
	const find = parts[parts.length - 1];
	for (const ext of TEXT_FILE_TYPES)
		if (ext === find) return true;
	return false;
}

/** takes a list of files and simplifies it down to the most root of selections
 * @param {string[]} paths the file paths to compare
 * @returns {string[]} the simplified list of files
 */
export function simplifyPathCollection(paths) {
	const items = [].concat(paths);

	// clean up the path list
	_.each(paths, path => {
		_.remove(items, item => {
			return item !== path && _.startsWith(item, path);
		});
	});

	return items;
}

export default {
	TEXT_FILE_TYPES,
	isTextContent
};