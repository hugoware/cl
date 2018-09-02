import _ from 'lodash';
import { getExtension } from "../utils";
import $brace from 'brace';
import ManagedEditor from './managed';

// import required stuff?
require('brace/mode/html');
require('brace/mode/css');
require('brace/theme/monokai');

// reused 
const Range = $brace.acequire('ace/range').Range;

// const SNIPPET_FONT_SIZE = 23;
// const EDITOR_FONT_SIZE = 18;
// const SNIPPET_LINE_HEIGHT = 1.5;

// default options for the code editor
const DEFAULT_OPTIONS = {
	fontSize: 18.5,
	fontFamily: 'code',
	lineHeight: 1.25,
	highlightGutterLine: false,
	enableBasicAutocompletion: true,
	enableSnippets: false,
	enableLiveAutocompletion: true,
	showFoldWidgets: false,
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

	/** determines the language to use for an editor based on a path
	 * @param {string} path the path or file name to use
	 * @returns {string} the language to use
	 */
	getLanguage(path) {
		const ext = getExtension(path, { removeLeadingDot: true });
		return $languages[ext] || $languages.plain;
	}

	/** creates a new code editor instance
	 * @param {HTMLElement} container the element to hold for the code editor
	 */
	createInstance(container) {

		// setup the code editor area
		const editor = $brace.edit(container);
		editor.setTheme("ace/theme/monokai");

		// set the theme options
		editor.setOptions(DEFAULT_OPTIONS);
		editor.container.style.lineHeight = DEFAULT_OPTIONS.lineHeight;
		editor.renderer.updateFontSize();

		// manage options
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableSnippets: true,
			enableLiveAutocompletion: false
		});

		// create the editor instance
		return new ManagedEditor(editor);

		// return this.editor.create(container, {
		// 	theme: 'vs-dark',
		// 	fontFamily: 'code',
		// 	fontSize: EDITOR_FONT_SIZE,
		// 	formatOnPaste: true,
		// 	formatOnType: true,
		// 	automaticLayout: true,
		// 	renderWhitespace: true
		// });
	}

	/** colorizes a snippet of code 
	 * @param {HTMLElement} element the element to colorize
	*/
	colorize(element, options) {
		// const { snippet } = options;

		// const editor = this.editor.create(element, {		
		// 	value: snippet.content,
		// 	language: snippet.language,	
		// 	theme: 'vs-dark',
		// 	fontFamily: 'code',
		// 	fontSize: SNIPPET_FONT_SIZE,
		// 	minimap: { enabled: false },
		// 	readOnly: true,
		// 	automaticLayout: true,
		// 	scrollBeyondLastLine: false,
		// 	disableLayerHinting: true,
		// 	matchBrackets: false,
		// 	showFoldingControls: false,
		// 	quickSuggestions: false,
		// 	contextmenu: false
		// });

		// // map out all highlighted areas, if any
		// if (options.highlight) {
		// 	const highlights = [ ];
		// 	_.each(options.highlight, zone => {

		// 		// make sure the highlight exists
		// 		const highlight = snippet.zones[zone];
		// 		if (!highlight) return;

		// 		// create the range
		// 		highlights.push({
		// 			range: new monaco.Range(
		// 				highlight.start.line + 1,
		// 				highlight.start.index + 1,
		// 				highlight.end.line + 1,
		// 				highlight.end.index + 1
		// 			),

		// 			options: {
		// 				isWholeLine: highlight.line,
		// 				inlineClassName: 'snippet-highlight'
		// 			}
		// 		});
		// 	});

		// 	// if there's ranges, update them now
		// 	if (_.some(highlights))
		// 		editor.deltaDecorations([], highlights);
		// }

		// // this it kinda dumb, but we have to manually set the size in this case
		// const height = (editor.getModel().getLineCount() * SNIPPET_FONT_SIZE) * SNIPPET_LINE_HEIGHT;
		// element.style.height = `${height}px`;

		// return editor;
	}

}


export default new EditorManager();