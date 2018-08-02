/// <reference path="../../../types/index.js" />
import $icons from '../../../icons';
import Component from '../../../component';
import { getPathInfo } from '../../../utils';

// handles displaying line item messages
export default class ConsoleMessage extends Component {

	constructor() {
		super({
			template: 'console-message',

			ui: {
				icon: '.icon',
				line: '.line',
				name: '.name',
				column: '.column',
				data: '.data',
				directory: '.directory',
				file: '.file',
			}
		});
	}

	/** @param {CompilerErrorMessage} err */
	update(err) {

		// determine if this is an exception message or not
		const isException = isNaN(err.line) || isNaN(err.column);
		this.toggleClass('is-exception', isException);
		
		// get data
		const info = getPathInfo(err.path);
		// const hint = getHint(data);

		// populate info
		this.ui.name.text(info.name);
		this.ui.file.text(info.file);
		this.ui.directory.text(info.directory);
		this.ui.line.text(err.line);
		this.ui.column.text(err.column);
		this.ui.data.text(err.message);
	}

}
