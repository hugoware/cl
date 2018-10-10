import _ from 'lodash';
import { getCompletions } from './autocomplete';
import $brace from 'brace';
import 'brace/ext/language_tools'

import ManagedEditor from './managed';
const Range = $brace.acequire('ace/range').Range;
const LanguageTools = $brace.acequire('ace/ext/language_tools');

// handle loading custom ones like this
window.LANG = LanguageTools;
_.each(window.COMPLETERS, completer => {
	LanguageTools.addCompleter(completer);
})


// validations
require('brace/mode/html');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/mode/xml');
require('brace/mode/css');
// require('brace/mode/lua');

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
	scrollPastEnd: 0.5,
	mergeUndoDeltas: true,
	printMarginColumn: -1
};

// common editor class
class EditorManager {

	/** waits for the monoaco editor to load */
	async init() {
		return Promise.resolve();
	}

	/** creates a new code editor instance
	 * @param {HTMLElement} container the element to hold for the code editor
	 */
	createInstance(container) {
		const editor = createEditor(container, {
			enableBasicAutocompletion: true, // [{ getCompletions }],
			enableSnippets: false,
			enableLiveAutocompletion: true
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
		const { snippet, highlight, zones } = options;
		const session = $brace.createEditSession(snippet.content, `ace/mode/${snippet.type}`);
		session.setOptions({ tabSize: 2, useWorker: false });
		editor.setSession(session);

		// check for highlighting
		if (highlight)
			_.each(highlight, key => {

				// check for the zone to highlight
				const zone = zones[key];
				if (!zone) return;

				// update the markers
				const { start, end, line } = zone;
				const range = new Range(start.row, start.col, end.row, end.col);
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