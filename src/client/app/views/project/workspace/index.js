import { _ } from '../../../lib';
import Component from '../../../component';
import TabBar from '../tab-bar';
import $state from '../../../state';

// workspaces
import CodeEditorWorkspace from './workspaces/code';
import ImageViewerWorkspace from './workspaces/image';
import MediaViewerWorkspace from './workspaces/media';
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
			media: new MediaViewerWorkspace(),
			'not-supported': new NotSupportedWorkspace()
		};

		// add each of the workspaces
		_.each(this.workspaces, workspace => {
			workspace.appendTo(this.ui.editors);
			workspace.hide();
		});

		// events
		this.listen('activate-file', this.onActivateFile);
		this.listen('activate-project', this.onActivateProject);
		this.listen('deactivate-project', this.onClearWorkspace);
		this.listen('clear-workspace', this.onClearWorkspace);
		this.listen('refresh-workspace', this.onRefreshWorkspace);
	}

	// handles creating resetable points
	onRefreshWorkspace = () => {

	}

	// clears all workspaces
	onClearWorkspace = () => {
		this.setWorkspace(null);
	}

	// handles when first loading the view
	onActivateProject = () => {
		this.clearWorkspace();
	}

	// activates the correct workspace
	onActivateFile = file => {
		console.log('acti');
		const type = file.type || 'not-supported';
		this.setWorkspace(type);
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
