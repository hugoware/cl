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

	/** returns the directory this file is within
	 * @returns {string} the parent directory path
	 */
	get parentDirectory() {
		const { parent } = this.file;
		return parent ? parent.path : '/';
	}

	/** updates the view content
	 * @param {string} file the path of the file that was changed
	 * @param {boolean} [forceRefresh] forces the view to refresh even if nothing has directly changed
	 */
	async refresh(file, forceRefresh = false) {
		const { path } = this.file;

		// if forcing a refresh, remove the compiled content
		// for this file - if any
		if (forceRefresh)
			await $contentManager.remove(path);
		
		// check if the view itself was file
		if (forceRefresh || !this.template || path === file) {
			await generateTemplate(this, path);
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

	/** checks if a view has a dependency on a file
	 * @param {string} path the file to check
	 */
	isDependency(path) {
		return this.file.path === path
			|| (this.links && this.links[path])
			|| (this.scripts && this.scripts[path]);
	}

}

// handles creating the base for the template view
async function generateTemplate(view, path) {

	// try to get the compiled content
	const markup = await $contentManager.get(path);
	view.template = $cheerio.load(markup);

	// storage for external resources
	view.scripts = { };
	view.links = { };

	// check for a title
	view.title = _.trim(view.template('title').text());

	// find all scripts
	view.template('script')
		.map((index, item) => {

			// make sure this is a valid file
			const origin = item.attribs.src;
			const src = resolvePathFromUrl(origin, view.parentDirectory);

			// no script was present or it's not a
			// file that's present in the project
			if (src === '/' || !$state.fileExists(src))
				return;

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
			const href = resolvePathFromUrl(item.attribs.href, view.parentDirectory);
			if (!$state.fileExists(href)) return;

			// save it for later
			const collection = view.links[href] = view.links[href] || [];
			collection.push(item);
		});

	// include a base url that'll make all local requests
	// for this preview match the project domain
	const domain = $state.getProjectDomain();
	view.template.root()
		.prepend(`
			<base href="${domain}" />
			<script browser-tools src="/__codelab__/browser.js" type="text/javascript" ></script>
		`);

}


// populate all dependencies
async function replaceDependencies(view, file) {
	const path = file && file.path;

	// refresh all
	if (path === view.file.path || !path) {
		
		// replace all linked content
		const links = _(view.links).keys().filter($state.fileExists).value();
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

		// replace each script
		const scripts = _(view.scripts).keys().filter($state.fileExists).value();
		for (const key of scripts) {

			// get the content to display
			const content = await $contentManager.get(key);

			// replace the script
			_.each(view.scripts[key], item => {
				item.attribs.type = 'text/javascript';
				delete item.attribs.src;
				$cheerio(item).html(content);
			});
		}

	}
	// targeted update?
	else {
		// const script = view.scripts[path];
		// const link = view.links[path];
		// console.log('found', script, link);
	}

	// done?
	return Promise.resolve();
}
