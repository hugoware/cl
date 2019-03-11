import _ from 'lodash';

import $path from '../path';
import $fsx from 'fs-extra';
import $yaml from 'js-yaml';

let $fileDefaults;

async function init() {
	console.log('[lessons] parsing file defaults');

	// read in the content
	const path = $path.resolveResource('file-defaults.yml');
	const content = $fsx.readFileSync(path);
	$fileDefaults = $yaml.load(content.toString());
}

/** checks if an extension has default content (including blank) 
 * @param {string} ext the extension to check for
 * @returns {boolean} does this file type exist
*/
function exists(ext, projectType) {
	return ext in $fileDefaults[projectType] || { };
};

/** returns the content for a file type
 * @param {string} ext the extension to look up
 * @returns {string} the content of the file (including blank)
 */
function get(ext, projectType) {
	return _.get($fileDefaults, `${projectType}.${ext}`);
};

export default {
	init,
	exists,
	get
};