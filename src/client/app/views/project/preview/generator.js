import _ from 'lodash';
import $cheerio from 'cheerio';
import { getExtension } from '../../../utils/index';
import contentManager from '../../../content-manager'


const VIEWABLE_EXTENSIONS = [
	'.html', 
	'.htm', 
	'.pug', 
	'.jade', 
	'.txt'
];

export default class PreviewGenerator {

	/** checks if a path can be viewed directly by the previewer
	 * @param {string} path the path to try and open
	 */
	static isViewable(path) {
		const ext = getExtension(path);
		return _.includes(VIEWABLE_EXTENSIONS, ext);
	}

	constructor() {
		/** @type {Object<string, View>} */
		this.views = { };
	}

	/** resets all views */
	clear() {
		this.views = { };
	}

	async sync(file) {
		this.view.sync();
	}

	/** changes the active preview */
	async setView(file) {

		const view = await View.get(file);
		this.view = view;
		await view.sync();



	}

	

}

class View {

	static async get(file) {
		const view = new View(file);
		return view;

	}

	constructor(file) {
		this.file = file;
	}

	async sync() {

		const content = await contentManager.get(this.file);

		try {
			const view = $cheerio.load(content);
			console.log(view);
		}
		// the view cannot be parsed -- show an error
		catch (err) {
			console.log('view error');
		}

		// // find dependencies
		// this.scripts = view('script');
		// this.stylesheets = view('link');

		// // update dependencies
		// _.each(this.scripts, script => {

		// });

		// _.each(this.stylesheets, stylesheet => {

		// });

	}



}