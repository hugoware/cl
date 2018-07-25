
import $api from '../../api';
import $nav from '../../nav';
import $state from '../../state';

import View from '../';
import FileBrowser from './file-browser';
import Workspace from './workspace';
import Console from './console';
import Preview from './preview';

export default class ProjectView extends View {

	constructor() {
		super({ 
			template: 'project-view',

			ui: {
				fileBrowser: '#file-browser',
				workspace: '#workspace',
				console: '#console',
				preview: '#preview',
			}
		});

		// ui elements
		this.fileBrowser = new FileBrowser(this.ui.fileBrowser);
		this.workspace = new Workspace(this.ui.workspace);
		this.console = new Console(this.ui.console);
		this.preview = new Preview(this.ui.preview);

	}

	// loads the data for this project view
	onActivate = async () => {
		const id = $nav.segments[1] || '';
		const project = await $api.request('get-project-data', id);

		// set the project data
		$state.updateProject(project);
		this.broadcast('activate-project', $state.project);
	}

}