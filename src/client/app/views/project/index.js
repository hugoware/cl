
import $api from '../../api';
import $nav from '../../nav';
import $state from '../../state';
import $lfs from '../../lfs';

import View from '../';
import FileBrowser from './file-browser';
import Workspace from './workspace';
import Console from './console';
import Preview from './preview';
import Assistant from './assistant';
import Definition from './definition';
import PreventActionPopUp from './prevent'

export default class ProjectView extends View {

	constructor() {
		super({ 
			template: 'project-view',

			ui: {
				fileBrowser: '#file-browser',
				workspace: '#workspace',
				console: '#console',
				preview: '#preview',
				assistant: '#assistant'
			}
		});

		// ui elements
		this.fileBrowser = new FileBrowser(this.ui.fileBrowser);
		this.workspace = new Workspace(this.ui.workspace);
		this.console = new Console(this.ui.console);
		this.preview = new Preview(this.ui.preview);
		
		// add the assistant layer separate
		this.assistant = new Assistant();
		this.assistant.appendTo(document.body);

		this.definition = new Definition(this.assistant);
		this.definition.appendTo(document.body);

		this.preventAction = new PreventActionPopUp();
		this.preventAction.appendTo(document.body);

		// helper for making sure changes are saved
		if ($state.isProd)
			window.onbeforeunload = () => {
				
				// must be able to save file
				if (!$state.checkPermissions(['SAVE_FILE']) || !$state.hasUnsavedFiles()) return null;
				return `You have unsaved changes! Are you sure you want to leave?`;
			};
	}

	// loads the data for this project view
	onActivate = async () => {
		this.broadcast('reset');
		
		// clear out the existing project, if any
		if ($state.project)
			this.broadcast('deactivate-project');

		// when activating, clean up the database
		await $lfs.clear();

		// load the new project
		const id = $nav.segments[1] || '';
		const project = await $api.request('get-project-data', id);
		
		// set the project data
		await $state.updateProject(project);
		await $state.updateLesson(project);

		// project is ready to use
		setTimeout(() => {
			this.broadcast('activate-project', $state.project);
		}, 500);
	}

}