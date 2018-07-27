import { getExtension } from "./utils";

// mappings of extensions to languages
const $languages = {
	pug: 'pug',
	jade: 'pug',
	xml: 'xml',
	yml: 'yaml',
	html: 'html',
	htm: 'html',
	java: 'java',
	json: 'json',
	scss: 'scss',
	sass: 'scss',
	css: 'css',
	cs: 'csharp',
	rb: 'ruby',
	sql: 'sql',
	sq: 'sql',
	md: 'markdown',
	vb: 'vb',
	lua: 'lua',
	js: 'javascript',
	ts: 'typescript',
	py: 'python',
	plain: 'plain'
};

// common editor class
class EditorManager {

	get editor() {
		return this._monaco.editor;
	}

	get core() {
		return this._monaco;
	}

	/** waits for the monoaco editor to load */
	async init() {
		const instance = this;

		// wait for the framework to appear
		return new Promise(resolve => {
			
			// wait for the monaco editor
			function wait() {
				instance._monaco = window.monaco;
				if (!instance._monaco)
					return setTimeout(wait, 100);

				// this was found
				resolve();
			}

			// kick off the first request
			wait();
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
		return this.editor.create(container, {
			theme: 'vs-dark',
			minimap: false,
			automaticLayout: true
		});
	}

}


export default new EditorManager();