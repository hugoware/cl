import { broadcast } from '../../events';
import $state from '../../state'

export default class EditorAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// removes zones
		this.area.clear = path =>
			broadcast('clear-working-area', path);

		// returns the current editor content
		this.area.content = () =>
			$state.editor.getWorkingAreaContent();

		// returns the current editor content
		this.area.lines = (start, end) =>
			this.area({ start, end, isLine: true });

		// removes the hint
		this.hint.clear = () =>
			broadcast('clear-hint');
			
		// standard inline hint validation
		this.hint.validate = result => {
			if (result && result.error)
				this.hint(result.error.message, result.error);
			else
				this.hint.clear();
		};

	}

	// changes the edit mode for a file
	readOnly = (file, readOnly = true) => {
		broadcast('set-editor-readonly', file, !!readOnly);
	}

	// sets the working area for the editor
	area = (options, end) => {
		if (_.isNumber(end)) {
			options = { start: options, end };
		}

		broadcast('set-working-area', options);
	}

	// sets the cursor posiiton
	cursor = (row, column) => {
		const options = _.isNumber(column) ? { row, column } : { index: row };
		broadcast('set-editor-cursor', options);
	}

	// sets the selected content
	selection = (start, end) => {
		broadcast('set-editor-selection', { start, end });
	}

	// sets the hint cursor information
	hint = (message, options = { }) => {
		
		// check if only an index was provided
		if (_.isNumber(options))
			options = { index: options };

		// update the hint
		options.message = message;
		broadcast('set-editor-focus-point', options);
		broadcast('show-hint', options);
	}

}