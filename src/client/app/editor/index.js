import { _, Brace } from '../lib';
// import { getCompletions } from './autocomplete';

import ManagedEditor from './managed';

// // handle loading custom ones like this
// window.LANG = LanguageTools;
// _.each(window.COMPLETERS, completer => {
// 	LanguageTools.addCompleter(completer);
// });

// configure Brace
Brace.config.set('basePath', '/__codelab__/ace');
Brace.config.set('modePath', '/__codelab__/ace');
Brace.config.set('themePath', '/__codelab__/ace');

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

/** waits for the monoaco editor to load */
export async function init() {
	return Promise.resolve();
}

/** creates a new code editor instance
 * @param {HTMLElement} container the element to hold for the code editor
 */
export function createInstance(container) {
	const editor = createEditor(container, {
		enableBasicAutocompletion: true, // [{ getCompletions }],
		enableSnippets: false,
		enableLiveAutocompletion: true,
		copyWithEmptySelection: false
	});

	// create the editor instance
	return new ManagedEditor(editor);
}

/** colorizes a snippet of code 
 * @param {HTMLElement} element the element to colorize
*/
export function colorize(element, options) {
	
	// view only editor area
	const editor = createEditor(element, {
		fontSize: options.fontSize || DEFAULT_SNIPPET_FONT_SIZE,
		useWorker: false,
		readOnly: true,
		maxLines: 500
	});
	
	// apply the snippet
	const { snippet, highlight } = options;
	const session = Brace.createEditSession(snippet.content, `ace/mode/${snippet.type}`);
	session.setOptions({ tabSize: 2, useWorker: false });
	editor.setSession(session);

	// check for highlighting
	_.each(highlight, ({ start, end, isLine }) => {
		start = editor.session.doc.indexToPosition(start);
		end = editor.session.doc.indexToPosition(end);
		const range = new Brace.Range(start.row, start.column, end.row, end.column);

		// save the highlight
		const index = session.addMarker(range);
		const marker = session.getMarkers()[index];
		marker.clazz = `snippet-highlight ${isLine ? 'fullLine' : ''}`;
		marker.inFront = true;
	});

	return { element, snippet, editor, session };
}

// setup a code editor area
function createEditor(container, options) {

	// setup the copied options
	options = _.assign({ }, DEFAULT_OPTIONS, options);

	// create the editor
	const editor = Brace.edit(container);
	editor.setTheme(DEFAULT_THEME);
	editor.setOptions(options);
	editor.container.style.lineHeight = DEFAULT_OPTIONS.lineHeight;
	editor.renderer.updateFontSize();
	return editor;
}

// shared default actions
export default {
	init,
	colorize,
	createInstance
}