
export const TEXT_FILE_TYPES = [
	
	// styling
	'css', 'scss', 'sass',
	
	// programming languages
	'js', 'jsx',
	'rb', 'cs', 'vs', 'py',

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

export default {
	TEXT_FILE_TYPES,
	isTextContent
};