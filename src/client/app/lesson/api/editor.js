import { broadcast } from '../../events';
import $state from '../../state'

export default class EditorAPI {

	constructor(lesson) {
		this.lesson = lesson;

		// removes zones
		this.area.clear = file =>
			broadcast('clear-working-area', file);

		// returns the current editor content
		this.area.content = file =>
			$state.editor.getWorkingAreaContent(file);

		// returns the current editor content
		this.area.lines = (file, start, end) =>
			this.area(file, { start, end, isLine: true });

		// removes the hint
		this.hint.clear = file =>
			broadcast('clear-hint');
			
		// standard inline hint validation
		this.hint.validate = (file, result) => {
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
	area = (file, options, end) => {		
		if (_.isNumber(end)) {
			options = { start: options, end };
		}

		broadcast('set-working-area', file, options);
	}

	// sets the cursor posiiton
	cursor = (file, row, column) => {
		const options = _.isNumber(column) ? { row, column } : { index: row };
		broadcast('set-editor-cursor', file, options);
	}

	// sets the selected content
	selection = (file, start, end) => {
		broadcast('set-editor-selection', file, { start, end });
	}

	// sets the hint cursor information
	hint = (file, message, options = { }) => {
		
		// check if only an index was provided
		if (_.isNumber(options))
			options = { index: options };

		// update the hint
		options.message = message;
		broadcast('set-editor-focus-point', options);
		broadcast('show-hint', options);
	}

}