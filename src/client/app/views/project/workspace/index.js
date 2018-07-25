import CodeEditor from './workspaces/code';
import Component from '../../../component';

import TabBar from '../tab-bar';

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

		this.workspaces = { 
			code: new CodeEditor()
		};

		this.workspaces.code.appendTo(this.ui.editors);

	}

	onChanged = () => {
		
	}

}