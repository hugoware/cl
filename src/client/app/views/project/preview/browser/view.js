import _ from 'lodash';
import $cheerio from 'cheerio';
import $contentManager from '../../../../content-manager';
import $state from '../../../../state'
import { resolvePathFromUrl } from '../../../../utils';

/** handles individual browser views */
export default class View {

	constructor(file) {
		this.file = file;
	}

	/** updates the view content
	 * @param {string} file the path of the file that was changed
	 */
	async refresh(file) {

		// check if the view itself was file
		const { path } = this.file;
		if (!this.template || path === file) {
			await generateTemplate(this);
		}

		// check if dependencies need to be refreshed
		await replaceDependencies(this, file);
	}

	/** generates the HTML used for this view
	 * @returns {string} the html markup
	 */
	getHTML() {
		return this.template.html();
	}

}

// handles creating the base for the template view
async function generateTemplate(view) {
	// try to get the compiled content
	const { path } = view.file;
	const markup = await $contentManager.get(path);
	view.template = $cheerio.load(markup);

	// include a base url that'll make all local requests
	// for this preview match the project domain
	const domain = $state.getProjectDomain();
	view.template.root()
		.prepend(`<base href="${domain}" />`);

	// storage for external resources
	view.scripts = { };
	view.links = { };

	// find all scripts
	view.template('script')
		.map((index, item) => {

			// make sure this is a valid file
			const src = resolvePathFromUrl(item.attribs.src);
			console.log('checking src', src);
			if (!src) return;

			// save it for later
			const collection = view.scripts[src] = view.scripts[src] || [];
			collection.push(item);
		});

	// find all linked resources
	view.template('link')
		.map((index, item) => {
			
			// make sure it's a type of stylesheet
			const isStylesheet =
				/^stylesheet$/i.test(item.attribs.rel) && // is stylesheet ref
				/^text\/(s?css|sass)$/i.test(item.attribs.type); // some sort of CSS type

			// skip if it's another kind of link
			if (!isStylesheet) return;

			// make sure this is a valid file
			const href = resolvePathFromUrl(item.attribs.href);
			if (!$state.fileExists(href)) return;

			// save it for later
			const collection = view.links[href] = view.links[href] || [];
			collection.push(item);
		});
}


// populate all dependencies
async function replaceDependencies(view, file) {
	const path = file && file.path;

	// refresh all
	if (path === view.file.path || !path) {
		const scripts = _(view.scripts).keys().filter($state.fileExists).value();
		const links = _(view.links).keys().filter($state.fileExists).value();

		// check each linked item
		for (const key of links) {

			// get the content to display
			const content = await $contentManager.get(key);

			// replace the script
			_.each(view.links[key], item => {
				item.tagName = 'style';
				item.attribs.type = 'text/css';
				delete item.attribs.href;
				delete item.attribs.rel;
				$cheerio(item).html(content);
			});
		}

		// replace each script as required
	}
	// targeted
	else {
		const script = view.scripts[path];
		const link = view.links[path];
		console.log('found', script, link);
	}


	// done?
	return Promise.resolve();
}
