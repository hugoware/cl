
import css from './css.txt';
import scss from './scss.txt';

import html from './html.txt';
import pug from './pug.txt';

import js from './js.txt';
import ts from './ts.txt';

import txt from './txt.txt';
import xml from './xml.txt';

const $types = {
	css,
	scss,
	html,
	pug,
	js,
	ts,
	txt,
	xml,
};

/** checks if an extension has default content (including blank) 
 * @param {string} ext the extension to check for
 * @returns {boolean} does this file type exist
*/
$types.exists = ext => {
	return ext in $types;
};

/** returns the content for a file type
 * @param {string} ext the extension to look up
 * @returns {string} the content of the file (including blank)
 */
$types.get = ext => {
	return $types[ext];
};

export default $types;