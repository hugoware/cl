import _ from 'lodash';
import { getExtension } from "../utils";
import $brace from 'brace';
$brace.Range = $brace.acequire('ace/range').Range;
import ManagedEditor from './managed';

// validations
require('brace/mode/html');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/mode/lua');
require('brace/mode/xml');
require('brace/mode/css');

// configure Brace
require('brace/theme/monokai');
$brace.config.set('basePath', '/__codelab__/ace');
$brace.config.set('modePath', '/__codelab__/ace');
$brace.config.set('themePath', '/__codelab__/ace');

// default options for the code editor
const DEFAULT_THEME = 'ace/theme/monokai';
const DEFAULT_SNIPPET_FONT_SIZE = 21.5;
const DEFAULT_OPTIONS = {
	fontSize: 18.5,
	fontFamily: 'code',
	lineHeight: 1.25,
	highlightGutterLine: false,
	enableBasicAutocompletion: true,
	enableSnippets: false,
	enableLiveAutocompletion: true,
	showFoldWidgets: false,
	showInvisibles: false,
	copyWithEmptySelection: false,
	scrollPastEnd: false,
	printMarginColumn: -1
};


// common editor class
class EditorManager {

	// get editor() {
	// 	return this._monaco.editor;
	// }

	// get core() {
	// 	return this._monaco;
	// }

	/** waits for the monoaco editor to load */
	async init() {
		const instance = this;

		// wait for the framework to appear
		return new Promise(resolve => {

			resolve();
			
			// // wait for the monaco editor
			// function wait() {
			// 	instance._monaco = window.monaco;
			// 	if (!instance._monaco)
			// 		return setTimeout(wait, 100);

			// 	// this was found
			// 	resolve();
			// }

			// // kick off the first request
			// wait();
		});
	}

	// /** determines the language to use for an editor based on a path
	//  * @param {string} path the path or file name to use
	//  * @returns {string} the language to use
	//  */
	// getLanguage(path) {
	// 	const ext = getExtension(path, { removeLeadingDot: true });
	// 	return $languages[ext] || $languages.plain;
	// }

	/** creates a new code editor instance
	 * @param {HTMLElement} container the element to hold for the code editor
	 */
	createInstance(container) {
		const editor = createEditor(container, {
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: false
		});

		// create the editor instance
		return new ManagedEditor(editor);
	}

	/** colorizes a snippet of code 
	 * @param {HTMLElement} element the element to colorize
	*/
	colorize(element, options) {
		
		// view only editor area
		const editor = createEditor(element, {
			fontSize: options.fontSize || DEFAULT_SNIPPET_FONT_SIZE,
			useWorker: false,
			readOnly: true,
			maxLines: 500
		});
		
		// apply the snippet
		const { snippet, highlight } = options;
		const session = $brace.createEditSession(snippet.content, `ace/mode/${snippet.language}`);
		session.setOptions({ tabSize: 2, useWorker: false });
		editor.setSession(session);

		// check for highlighting
		if (highlight)
			_.each(highlight, key => {
				const zone = snippet.zones[key];
				const { start, end, line } = zone;
				const range = new $brace.Range(start.line, start.index, end.line, end.index);
				editor.session.addMarker(range, 'snippet-highlight', line ? 'fullLine' : '');
			});

		return { element, snippet, editor, session };
	}

}

// setup a code editor area
function createEditor(container, options) {

	// setup the copied options
	options = _.assign({ }, DEFAULT_OPTIONS, options);

	// create the editor
	const editor = $brace.edit(container);
	editor.setTheme(DEFAULT_THEME);
	editor.setOptions(options);
	editor.container.style.lineHeight = DEFAULT_OPTIONS.lineHeight;
	editor.renderer.updateFontSize();
	return editor;
}


export default new EditorManager();