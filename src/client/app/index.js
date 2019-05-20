import { $, _, Bluebird, Cheerio } from './lib';
import CodeValidator from './validation/code-validator';
import HtmlValidator from './validation/html-validator';
import CssValidator from './validation/css-validator';
import HtmlValidationHelper from './utils/html-validation-helper'

// extensions
import * as __extensions__ from './extensions';

import $api from './api';
import $state from './state';
import $nav from './nav';
import $editor from './editor';
import Component from "./component";

// page components
import Header from './header';
import Footer from './footer';
import BackButton from './back';

// sub views
import HomeView from './views/home'
import ProjectView from './views/project'

// dialogs
import CreateProjectDialog from './dialogs/create-project';
import CreateFileDialog from './dialogs/create-file';
import CreateFolderDialog from './dialogs/create-folder';
import RemoveItemsDialog from './dialogs/remove-items';
import RenameItemDialog from './dialogs/rename-item';
import MoveItemsDialog from './dialogs/move-items'
import UnsavedChangesDialog from './dialogs/unsaved-changes';
import UploadFileDialog from './dialogs/upload-file';
import ShareProjectDialog from './dialogs/share-project';
import ProjectSettingsDialog from './dialogs/project-settings';
import RemoveProjectDialog from './dialogs/remove-project';
import ResetLessonDialog from './dialogs/reset-lesson';
import $speech from './speech'
import runTests from './utils/run-tests';

// configurations
window.Promise = window.Promise || Bluebird;
Bluebird.config({ warnings: false });

// shared channel for iframe access
window.__CODELAB__ = { };

// share library access
window.__CODELAB_LIBS__ = {
	_,
	$: Cheerio,
	CodeValidator,
	HtmlValidator,
	CssValidator,
	HtmlValidationHelper,
	runTests
};

// the main app class
class App extends Component {

	// handles loading the app for the first time
	static async init() {
		
		// wait for resources
		await $editor.init();
		await $speech.init();

		// create the app
		const app = new App();
		app.appendTo(document.body);
		app.start();
	}

	constructor() {
		super({
			template: 'app',
			ui: {
				view: '#view',
				header: '#header',
				footer: '#footer',
				back: '#back',
			}
		});

		this.header = new Header({ $: this.ui.header });
		this.back = new BackButton({ $: this.ui.back });
		this.footer = new Footer({ $: this.ui.footer });

		// sub views
		this.views = {
			home: !$state.isDemoMode && new HomeView(),
			project: new ProjectView()
		};

		// dialog windows
		this.dialogs = $state.isDemoMode ? { } : {
			createProject: new CreateProjectDialog(),
			createFile: new CreateFileDialog(),
			createFolder: new CreateFolderDialog(),
			removeItems: new RemoveItemsDialog(),
			renameItem: new RenameItemDialog(),
			unsavedChanges: new UnsavedChangesDialog(),
			moveItems: new MoveItemsDialog(),
			uploadFile: new UploadFileDialog(),
			resetLesson: new ResetLessonDialog(),
			projectSettings: new ProjectSettingsDialog(),
			removeProject: new RemoveProjectDialog(),
			shareProject: new ShareProjectDialog(),
		};

		// shared events
		const win = Component.bind(window);
		win.on('resize', this.onWindowResize);
		win.on('unload', this.onWindowUnload);
		win.on('keyup', this.onKeyUp);

		// events
		this.listen('navigate', this.onNavigate);
		this.listen('open-dialog', this.onShowDialog);
		this.listen('hide-all-dialogs', this.onHideAllDialogs);

		// establish operating system
		const doc = Component.bind(document.body);
		const isOSX = /mac/i.test(navigator.platform);
		doc.toggleClassMap({
			'osx': isOSX,
			'win': !isOSX,
			'local': $state.isLocal,
			'is-project-mode': $state.isDemoMode,
			'is-demo-mode': $state.isDemoMode
		});

		// set initial navigation
		if ($state.isDemoMode) {
			$nav.go(`project/demo`);
			$nav.go = () => { };
		}
	}

	// initialize the app
	start = async () => {
		try {
			const user = await $api.init();
			$state.user = user;
		}
		catch (err) {
			console.log('err');
		}

		// setup common events
		// window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('preview-message', this.onPreviewContentMessage);

		this.setView($nav.view);
	}

	// handles broadcasted messages
	onPreviewContentMessage = event => {
		this.broadcast('preview-message', event.name, ...event.args);
	}

	// handle general navigation
	onNavigate = () => {
		this.setView($nav.view);
	}

	// checks when the window size has changed
	onWindowResize = event => {
		this.broadcast('window-resize', event);
	}

	// window is exiting
	onWindowUnload = event => {
		this.broadcast('window-unload', event);
	}

	// handles when the keyboard is pressed
	onKeyUp = event => {
		this.broadcast('keypress', event);

		// check for specific keys
		if (event.keyCode === 27) // esc
			this.broadcast('press-esc', event);
	}
	
	/** changes the active view
	 * @param {Component} view The new view to use
	 */
	setView = async (view) => {

		// prevents view switching while already in progress
		if (this.transitioning) return;
		this.transitioning = true;

		// since we're changing views, we shouldn't really
		// ever have a dialog stay open
		this.hideDialogs();

		// check for the view first
		if (!this.views[view])
			view = 'missing';

		// update the screen mode
		this.toggleClassMap({
			'is-project': view === 'project',
			'is-home': view === 'home',
			'is-missing': view === 'missing',
		});

		// find the view to show
		view = this.views[view] || this.views.missing;

		// hide the current view
		const active = this.activeView;
		if (active)
			await active.hide();

		// save this for deactivation steps
		this.activeView = view;
		
		// now that it's ready, show and activate it
		try {
			view.appendTo(this.ui.view);
			await view.show();
		}
		// not sure yet
		catch (err) {
			throw err;
		}
		// allow views to switch again
		finally {
			this.transitioning = false;
		}

	}

	// handles showing a dialog window
	onShowDialog = (key, options = { }) => {
		key = _.camelCase(key);

		// hide everything first
		this.hideDialogs(key);

		// find the dialog to display
		// and then show it with options
		const dialog = this.dialogs[key];
		if (!dialog) console.warn(`no dialog found for ${key}`);
		else dialog.show(options);
	}

	// hides all dialog windows
	onHideAllDialogs = () => {
		this.hideDialogs();
	}

	// hide all dialogs for the app
	hideDialogs = exclude => {
		_.each(this.dialogs, (dialog, id) => {
			if (exclude !== id) dialog.hide(true);
		});
	}

}

$(App.init);