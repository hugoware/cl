import _ from 'lodash';
import $lfs from '../../../lfs';
import $state from '../../../state';
import Component from '../../../component';
import $cheerio from 'cheerio';
import getWorker from '../../../worker';
import PreviewGenerator from './generator';
import { getExtension } from '../../../utils';
import contentManager, {update} from '../../../content-manager';

export default class Preview extends Component {

	constructor(context) {

		super({
			context,
			template: 'preview',

			ui: {
				output: '.content iframe',
				url: '.url input'
			}
		});

		// current views
		this.views = { };

		// events
		this.listen('activate-project', this.onActivateProject);
		this.listen('activate-file', this.onActivateFile);
		this.listen('compile-file', this.onCompileFile);
	}

	get output() {
		return this.ui.output[0].contentWindow.document.body;
	}

	// changes the display mode for the project
	setMode = mode => {

		// manually replace all modes
		let cx = this.attr('class') || '';
		console.log('is', cx);
		cx = cx.replace(/mode\-[a-z]+/, '');
		cx = cx.replace(/ +/, ' ');
		cx = _.trim(cx);
		cx += ` mode-${mode}`;

		// update the value
		this.attr('class', cx);
	}

	// prepare the preview window
	onActivateProject = async () => {

		await $lfs.write('_header.pug', `h1 from the header`);
		await $lfs.write('main.pug', `h1 main pug
script(src='main.js' type='text/javascript')
p my para
link(rel='stylesheet' type='text/css' href='/style.scss')`);
		await $lfs.write('style.scss', `$main-color: #f00;
h1 {
  color: $main-color;
}`);

		const main = $state.findItemByPath('main.pug');
		main.content = `h1 main pug
script(src='main.js' type='text/javascript')
p my para
link(rel='stylesheet' type='text/css' href='/style.scss')`;

	}

	// handles when files are loaded
	onActivateFile = async file => {
		if (!_.endsWith(file.path, '.pug'))
			return;

		// find the view to use
		this.view = this.views[file.path] = this.views[file.path] || new View(file);
		await this.view.refresh();

		// display the result
		const html = this.view.getHTML();
		this.output.innerHTML = html;
	}

	// check for dependencies and update
	onCompileFile = async file => {
		if (!this.view) return;

		// check the dependency
		if (this.view.hasDependency(file))
			await this.view.refresh(file);

		// refresh them markup
		const html = this.view.getHTML();
		this.output.innerHTML = html;
	}

	// changes the preview window location
	onSetPreviewUrl = () => {

	}

	// checks if anything need to be compiled again
	onFileUpdated = file => {

	}

}


class View {

	constructor(file) {
		this.file = file;
	}

	async refresh(updated) {
		
		// check if the view itself was updated
		const { path } = this.file;
		if (!this.template || path === updated) {
			await generateTemplate(this);
		}

		// check if dependencies need to be refreshed
		await replaceDependencies(this, updated);
	}

	hasDependency(file) {
		console.log('will check');
		return this.file.path === file
			|| this.scripts[file]
			|| this.links[file];
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
	const markup = await contentManager.get(path);
	view.template = $cheerio.load(markup);

	// storage for external resources
	view.scripts = { };
	view.links = { };

	// find all scripts
	view.template('script')
		.map((index, item) => {

			// make sure this is a valid file
			const src = getPathFromURL(item.attribs.src);
			if (!src) return;

			// save it for later
			const collection = view.scripts[src] = view.scripts[src] || [ ];
			collection.push(item);
		});

	// find all linked resources
	view.template('link')
		.map((index, item) => {

			// make sure this is a valid file
			const href = getPathFromURL(item.attribs.href);
			if (!isLocalFile(href)) return;

			// save it for later
			const collection = view.links[href] = view.links[href] || [ ];
			collection.push(item);
		});
}

// populate all dependencies
async function replaceDependencies(view, file) {
	console.log('rep', file);
	const path = file && file.path;

	// refresh all
	console.log('check for', path);
	if (path === view.file.path || !path) {
		
		// _.each(view.scripts, key => {
		// 	console.log('checking for script', key);
		// });
		
		// get the matched resources
		// const scripts = _.filter(view.scripts, (items, key) => $state.fileExists(key));
		
		const scripts = _(view.scripts).keys().filter($state.fileExists).value();
		const links = _(view.links).keys().filter($state.fileExists).value();

		// check each linked item
		for (const key of links) {
			const content = await contentManager.get(key);

			_.each(view.links[key], item => {
				item.tagName = 'style';
				item.attribs.type = 'text/css';
				delete item.attribs.href;
				delete item.attribs.rel;
				item.children = [{ data: content, type: 'text' }];
				// $cheerio(item).text(content);
				console.log(item);
			});

			console.log('replace with', content);
		}
		
		
	}
	// targeted
	else {

		const script = view.scripts[path];
		const link = view.links[path];

		console.log('found', script, link);
	}



	return Promise.resolve();
}

// checks if this is a file in the project
function isLocalFile(path) {
	return !!$state.findItemByPath(path);
}

// gets a file path from a url
function getPathFromURL(path) {
	path = _.trim(_.trim(path).split('?')[0]);
	return path.replace(/^\/?/, '');
}