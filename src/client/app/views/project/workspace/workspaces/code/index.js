
import $lfs from '../../../../../lfs';
import Component from '../../../../../component';
import contentManager from '../../../../../content-manager'


export default class CodeEditor extends Component {

	constructor() {
		super({
			template: 'workspace-code-editor',

			ui: {
				editor: 'textarea'
			}
		});

		this.ui.editor.on('keyup', this.onChange);
		this.listen('activate-file', this.onActivateFile);

	}

	// handle shwne the editor has changes made
	onChange = () => {
		const data = this.ui.editor.val();
		contentManager.update(this.file.path, data);
	}

	// handles when a file is activated (opened or tab selected)
	onActivateFile = async (file) => {
		this.file = file;
		
		// set the raw data value
		const content = await $lfs.read(file.path);
		this.ui.editor.val(content);

	}

}