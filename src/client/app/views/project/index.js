
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
	}

	// loads the data for this project view
	onActivate = async () => {
		this.broadcast('clear-project');
		
		// clear out the existing project, if any
		if ($state.project)
			this.broadcast('deactivate-project');

		// when activating, clean up the database
		await $lfs.clear();

		// load the new project
		const id = $nav.segments[1] || '';
		const project = await $api.request('get-project-data', id);

		// TODO: lesson programming
		project.lesson = 'web_basics_1';
		
		// set the project data
		await $state.updateProject(project);
		await $state.updateLesson(project);

		// project is ready to use
		this.broadcast('activate-project', $state.project);
	}

}