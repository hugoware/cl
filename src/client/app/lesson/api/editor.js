import { _ } from '../../lib';
import { broadcast } from '../../events';
import $state from '../../state'
import { getPath } from './utils';

export default class EditorAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// removes zones
		this.area.clear = ({ path, file } = { }) => {
			path = getPath(path || file);
			broadcast('clear-working-area', path);
		};

		// returns the current editor content
		this.area.get = ({ path, file }) => {
			path = getPath(path || file);
			return $state.editor.getWorkingAreaContent(path);
		};

		// returns the current editor content
		this.area.lines = ({ path, file, start, end }) => {
			return this.area({ path, file, start, end, isLine: true });
		};

		// removes the hint
		this.hint.clear = ({ path, file } = { }) => {
			path = getPath(path || file);
			broadcast('clear-hint', path);
		};

		this.hint.disable = options => {
			broadcast('disable-hints', options);
		};

		this.hint.enable = options => {
			broadcast('enable-hints', options);
		};
			
		// standard inline hint validation
		this.hint.validate = ({ path, file, result }) => {
			if (result && result.error) {
				const { start, end, index, message } = result.error;
				this.hint({ path, file, message, start, end, index });
			}
			else
				this.hint.clear({ path, file });
		};

	}

	// gives back the active item
	activeTab = () => {
		return $state.activeFile;
	}

	// sets the working area for the editor
	area = ({ path, file, start, end }) => {
		path = getPath(path || file);
		broadcast('set-working-area', { path, start, end });
	}

	// sets the cursor posiiton
	cursor = ({ path, file, row, column, start, end, index }) => {
		path = getPath(path || file);
		broadcast('set-editor-cursor', { path, row, column, start, end, index });
	}

	// sets the selected content
	selection = ({ path, file, start, end }) => {
		path = getPath(path || file);
		broadcast('set-editor-selection', { path, start, end });
	}

	// sets the hint cursor information
	hint = ({ path, file, message, start, end, index }) => {
		path = getPath(path || file);
		
		// // check if only an index was provided
		// if (_.isNumber(options))
		// 	options = { index: options };

		// update the hint
		broadcast('set-editor-focus-point', { start, end, index });
		broadcast('show-hint', { message });
	}

	// sets the focus to the editor
	focus = () => {
		setTimeout($state.editor.setFocus);
	}

}