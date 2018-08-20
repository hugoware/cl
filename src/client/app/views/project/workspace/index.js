import _ from 'lodash';
import Component from '../../../component';
import TabBar from '../tab-bar';
import $state from '../../../state';

// workspaces
import CodeEditorWorkspace from './workspaces/code';
import ImageViewerWorkspace from './workspaces/image';
import NotSupportedWorkspace from './workspaces/not-supported';

export default class Workspace extends Component {

	constructor(context) {
		super({
			context,
			template: 'workspace',

			ui: {
				editors: '.editors'
			}
		});

		// include the tab bar
		this.tabs = new TabBar();
		this.prepend(this.tabs);

		// create each workspace
		this.workspaces = { 
			code: new CodeEditorWorkspace(),
			image: new ImageViewerWorkspace(),
			'not-supported': new NotSupportedWorkspace()
		};

		// add each of the workspaces
		_.each(this.workspaces, workspace => {
			workspace.appendTo(this.ui.editors);
			workspace.hide();
		});

		// events
		this.listen('activate-file', this.onActivateFile);
		this.listen('clear-workspace', this.onClearWorkspace);
	}

	// clears all workspaces
	onClearWorkspace = () => {
		console.log('wants to clear');
		this.setWorkspace(null);
	}

	// activates the correct workspace
	onActivateFile = file => {
		const workspace = getWorkspace(this, file);
		this.setWorkspace(workspace);
	}

	// sets the workspace to display
	setWorkspace(key) {

		// try and show a workspace
		let hasWorkspace;
		_.each(this.workspaces, (workspace, name) => {
			if (name === key && !hasWorkspace) {
				hasWorkspace = true;
				workspace.show();
			}
			else workspace.hide();
		});

		// toggle is something is active or not
		this.toggleClass('has-workspace', hasWorkspace);
	}

	clearWorkspace = () => {
		_.each(this.workspaces, workspace => workspace.hide());
	}

}

function getWorkspace(instance, file) {

	console.log('find workspace', file);

	return 'code';
}