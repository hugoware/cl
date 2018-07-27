import $ from 'jquery';
import _ from 'lodash';
import $api from './api';
import $state from './state';
import nav from './nav';
import $editor from './editor';
import Component from "./component";
import Bluebird from 'bluebird';

// sub views
import HomeView from './views/home'
import ProjectView from './views/project'

// dialogs
import CreateProjectDialog from './dialogs/create-project';
import CreateFileDialog from './dialogs/create-file';
import CreateFolderDialog from './dialogs/create-folder';
import RemoveItemsDialog from './dialogs/remove-items';

// configurations
window.Promise = window.Promise || Bluebird;
Bluebird.config({ warnings: false });

// the main app class
class App extends Component {

	// handles loading the app for the first time
	static async init() {
		// wait for resources
		await $editor.init();

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
				footer: '#footer'
			}
		});

		// sub views
		this.views = {
			home: new HomeView(),
			project: new ProjectView()
		};

		// dialog windows
		this.dialogs = {
			createProject: new CreateProjectDialog(),
			createFile: new CreateFileDialog(),
			createFolder: new CreateFolderDialog(),
			removeItems: new RemoveItemsDialog(),
		};

		// events
		this.listen('navigate', this.onNavigate);
		this.listen('open-dialog', this.onShowDialog);
		this.listen('compiler-result', this.onCompilerResult);
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

		this.setView(nav.view);
	}

	// handle general navigation
	onNavigate = () => {
		this.setView(nav.view);
	}
	
	/** changes the active view
	 * @param {Component} view The new view to use
	 */
	setView = async (view) => {
		view = this.views[view] || this.views.missing;

		// hide the current view
		const active = this.activeView;
		if (active) await active.hide();

		// save this for deactivation steps
		this.activeView = view;
		
		// now that it's ready, show and activate it
		view.appendTo(this.ui.view);
		await view.show();
	}

	// handles showing a dialog window
	onShowDialog = (key, options = { }) => {
		key = _.camelCase(key);

		// hide all dialogs now
		_.each(this.dialogs, (dialog, id) => {
			if (key !== id) dialog.hide(true);
		});

		// find the dialog to display
		const dialog = this.dialogs[key];
		dialog.options = options;

		console.log('will try and show', key, dialog);

		// show the dialog window
		dialog.show();
	}

	// needs to show error messages or not
	onCompilerResult = result => {
		this.toggleClass('console-visible', !result.success);
	}

}

$(App.init);