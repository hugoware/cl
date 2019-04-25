/// <reference path="../../../../types/index.js" />

import { _, $, HtmlTagValidator } from '../../../../lib';
// import View from './view';
import $state from '../../../../state';
import $contentManager from '../../../../content-manager';
import Component from '../../../../component';
import { getExtension } from '../../../../utils/index';
import $errorManager from '../../../../error-manager';


// create the preview mode
export default class MobileMode extends Component {

	constructor(preview) {
		super({
			template: 'preview-mobile',

			ui: {
				output: '.device iframe.output'
			}
		});

		// save the preview instance
		this.preview = preview;

		/** the current views cached for the browser
		 * @type {Object<string, View>} */
		this.views = { };

		// // listen for the preview window to broadcast changes
		// this.listen('reset', this.onReset);
		// this.listen('rename-item', this.onRenameItem);
		// this.listen('delete-items', this.onDeleteItems);
		// this.ui.output.on('mouseover', this.onAutoExecuteScripts);
		// this.ui.runScripts.on('click', this.onRunPageScripts);
		// this.ui.url.on('change', this.onUrlChanged);

		// set the default view
		// setTimeout(this.clear);
	}

	// handle activation
	onActivateProject = () => {
		this.render();
	}

	// exiting the project
	onDeactivateProject = () => {

	}

	// switched files
	onActivateFile = file => {

		// only preview HTML files
		if (!/.html?$/.test(file.path) || (this.activeFile && this.activeFile.path === file.path))
			return;

		// set the active file
		this.activeFile = file;
		this.render();
	}

	onCompileFile = () => {
		clearTimeout(this.pending);
		this.pending = setTimeout(this.render, 1000);
	}

	render = async () => {

		// gather all HTML files
		const html = _($state.files)
			.filter(item => /\.html?$/.test(item.path))
			.map(item => 'current' in item ? item.current : item.content)
			.join('\n\n');

		// compile the javascript file
		// compile the code -- save any errors
		// directly to the runner. When `.run` is called
		// that error will be thrown right away
		let ex;
		await $contentManager.compile('/app.js', {
			onError: error => ex = error,
			silent: true
		});

		// get the code to execute
		const code = await $contentManager.get('/app.js');

		const markup = `<!DOCTYPE html>
			<html>
			<head>
				<link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsenui.css">
				<link rel="stylesheet" href="https://unpkg.com/onsenui/css/onsen-css-components.min.css">
				<script src="https://unpkg.com/onsenui/js/onsenui.min.js"></script>
			</head>
			<body>
				${html}

				<script>
					var app = window.APP = { };
					ons.ready(function() {
						${code}
					});
				</script>
			</body>
			</html>`;

		// this.context.document.innerHtml = markup;
		// console.log('ml', markup);

		this.writeContent(markup);
		
	}

	// /** changes the browser view URL 
	//  * @param {string} value the new url to use
	// */
	// set url(value) {
	// 	this.ui.url.val(value);
	// }

	// /** gets the current address bar url
	//  * @returns {string} the current url
	//  */
	// get url() {
	// 	return this.ui.url.val();
	// }

	// /** changes the browser view title */
	// set title(value) {
	// 	this.ui.title.text(value);
	// }

	/** access to the output window
	 * @type {HTMLElement} the preview DOM element
	 */
	get output() {
		return this.context.document.body;
	}

	/** returns the window context for the preview */
	get context() {
		return this.ui.output[0].contentWindow;
	}

	/** access to helper scripts for the main window */
	get bridge() {
		return this.context.__CODELAB__;
	}

	// /** checks if a view is visible
	//  * @returns {boolean} */
	// get hasActiveView() {
	// 	return !!this.activeFile;
	// }

	// /** returns the active file
	//  * @returns {ProjectItem}
	//  */
	// get activeFile() {
	// 	return this.view && this.view.file;
	// }

	// // tries to navigate to a new location
	// onUrlChanged = () => {
	// 	const { url } = this;
	// 	this.navigate(url);
	// }

	// // handles starting a new project
	// onActivateProject = async project => {
	// 	this.views = { };
	// }

	// // automatically refresh scripts when mousing over
	// onAutoExecuteScripts = () => {
	// 	if (!this.hasRunScripts)
	// 		this.runScripts();
	// }

	// // kicks off page scripts
	// onRunPageScripts = () => {
	// 	this.runScripts();
	// }

	// // check for renames to update the URL bar
	// onRenameItem = item => {
	// 	if (this.url === item.previous.path)
	// 		this.url = item.path;
	// }

	// // checks if a view should refresh because
	// // a file was deleted
	// onDeleteItems = paths => {
	// 	if (!this.hasActiveView) return;
	// 	const { view } = this;
	// 	const { file } = view;

	// 	// check if the view was deleted
	// 	for (const path of paths) {
	// 		if (path === file.path)
	// 			return this.clear();
	// 	}

	// 	// check if a dependency might have been removed
	// 	for (const path of paths) {
	// 		if (view.isDependency(path))
	// 			return this.recompile();
	// 	}

	// }

	// // handles incoming preview messages
	// onPreviewMessage = (err, args = { }) => {
	// 	if (!this.hasActiveView) return;

	// 	// handling a script error
	// 	if (err === 'error' && this.activeFile) {
	// 		args = _.assign({ }, args);
	// 		args.path = this.activeFile.path;
	// 		this.setPageError(args);
	// 	}

	// 	// handle general navigation
	// 	else if (args.navigate)
	// 		this.navigate(args.navigate);

	// 	// else if ('console.log' === name)
	// 	// else if ('console.log' === name)
	// 	// else if ('console.log' === name)

	// 	else {
	// 		// console.log('preview message', err, args);
	// 	}
	// }

	// // handles deactivating a project entirely
	// onDeactivateProject = () => {
	// 	this.views = { };
	// 	this.clear();
	// }

	// // handles closing a file from preview
	// onCloseFile = file => {
	// 	if (!this.hasActiveView) return;
	// 	if (this.activeFile.path === file.path)
	// 		this.clear();
	// }

	// // sets the default view content
	// onActivateFile = async (file, viewOnly) => {
	// 	const { path } = file;

	// 	// show the previewer
	// 	this.ui.viewer.hide();
	// 	this.ui.output.show();
		
	// 	// determine if activating the file should replace
	// 	// the view that's in the preview or not
	// 	const ext = getExtension(path, { removeLeadingDot: true });
	// 	if (!_.includes(VIEWABLE_TYPES, ext))
	// 		return;

	// 	// update the url
	// 	this.url = path;

	// 	// find the view to use
	// 	const view = this.views[path] = this.views[path] || new View(file);
	// 	await view.refresh(path, { forceRefresh: true });

	// 	// if just showing the view only
	// 	if (!viewOnly) {
	// 		this.clearPageError();
	// 		this.view = view;
	// 	}

	// 	// display the view
	// 	this.render(view, true);
	// }

	// // handles replacing the content of the view if 
	// // dependencies require it
	// onCompileFile = async file => {
	// 	if (!this.view) return null;

	// 	// refresh the view
	// 	await this.view.refresh(file);
	// 	this.render(this.view);
	// }

	// // resetting the view
	// onReset = () => {
	// 	this.reset();
	// }
	
	// /** handles completely resetting the preview window */
	// reset() {
	// 	this.ui.viewer.hide();
	// 	this.ui.output.show();

	// 	if (!!this.output) {
	// 		this.output.innerHTML = '';
	// 		this.output.outerHTML = this.output.outerHTML;
	// 		this.output.innerHTML = NO_PREVIEW_LOADED;
	// 	}
	// }

	// // navigates to a new url
	// navigate = url => {

	// 	// check for canceling
	// 	if ($state.lesson && $state.lesson.respondsTo('beforePreviewAreaNavigate')) {
	// 		if ($state.lesson.invoke('beforePreviewAreaNavigate', url) === false)
	// 			return;
	// 	}

	// 	// notify the action
	// 	if ($state.lesson)
	// 		$state.lesson.invoke('navigatePreviewArea', url, getPreviewAccess(this));

	// 	// navigate
	// 	this.broadcast('preview-area-navigate', url)
		
	// 	// this should be for another file in the project
	// 	url = _.trim(url).split('?')[0];
	// 	const file = $state.findItemByPath(url);

	// 	// there's not a file - do a 404 page
	// 	if (!file) {
	// 		this.output.innerHTML = 'page not found: 404';
	// 		this.url = url;

	// 		console.log('TODO: needs a message or a 404');
	// 	}
	// 	// check the type of file
	// 	else if ('content' in file) {
	// 		this.url = file.path;
	// 		this.onActivateFile(file, true);
	// 	}
		
	// 		// a url based file
	// 	else {
	// 		const url = $state.getProjectDomain() + file.path;
	// 		this.url = file.path;
	// 		this.ui.viewer.attr('src', url);
	// 		this.ui.viewer.show();
	// 		this.ui.output.hide();
	// 	}
		
	// }

	// /** includes a new page error
	//  * @param {ProjectError} error the error to assign
	//  */
	// setPageError = error => {
	// 	if (!this.hasActiveView) return;
	// 	error.file = this.activeFile.path;
	// 	this.activeError = `script:${this.activeFile.path}`; 
	// 	$errorManager.add(this.activeError, error);
	// }

	// /** handles removing errors on the page, if any */
	// clearPageError = () => {
	// 	if (!this.activeError) return;
	// 	$errorManager.remove(this.activeError);
	// 	delete this.activeError;
	// }

	/** replaces the page content with new HTML
	 * @param {string} html the content to write
	 */
	writeContent = html => {
		const frame = Component.select('<iframe class="output" />');
		this.ui.output.replaceWith(frame);
		this.ui.output = frame;
		
		// console.log('eh');
		// this.context.location.reload(true);
		const doc = this.context.document;
		doc.open();
		doc.write(html);
		setTimeout(() => { doc.close(); }, 10);
	}

	// /** displays the most current template result 
	//  * @param {boolean} shouldRunScripts should the render also eval scripts
	// */
	// render = (view, shouldRunScripts) => {

	// 	// clear any scripting errors
	// 	this.clearPageError();
		
	// 	// generate the file again
	// 	const html = view.getHTML();
		
	// 	// extra steps are to make sure that the
	// 	// document body is also cleared of all event
	// 	// listeners
	// 	this.reset();
	// 	this.writeContent(html);
		
	// 	// populate the title, if possible
	// 	const title = view.title || 'Untitled Page';
	// 	this.title = title;
	// 	this.url = view.file.path;

	// 	// since we're resetting the page, clear any
	// 	// scripting flags
	// 	this.hasRunScripts = false;
	// 	if (shouldRunScripts)
	// 		this.runScripts();

	// 	// notify this has access
	// 	setTimeout(() => {
	// 		if ($state.lesson)
	// 			$state.lesson.invoke('updatePreviewArea', this.url, view.file.current, getPreviewAccess(this));
	// 	}, 100);

	// }

	// // removes the current view
	// clear = () => {
	// 	this.clearPageError();
	// 	this.reset();
	// 	this.writeContent(NO_PREVIEW_LOADED);
	// 	this.title = '';
	// 	this.url = '';
	// 	delete this.view;
	// }

	// // force a recompile of this view
	// recompile = async () => {
	// 	if (!this.hasActiveView) return;

	// 	// force a compiled refresh
	// 	const { file } = this.view;
	// 	await this.view.refresh(file, true);
	// 	this.render(this.view);
	// }

	// // execute scripts
	// runScripts = () => {

	// 	// TODO: figure out why this is null when creating
	// 	if (!this.bridge) return;

	// 	// if the scripts have already run once then
	// 	// refresh the content before executing
	// 	if (this.hasRunScripts)
	// 		this.render(this.view);

	// 	// execute the scripts
	// 	this.hasRunScripts = true;
	// 	this.bridge.evalScripts();
	// }

}
