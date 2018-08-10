import $ from 'jquery';

/** helper for text selection, including contenteditables */
$.fn.selectText = function() {

	// normal text selection
	if (this.is('input'))
		return this.focus().select();

	// for content editable
	if (this.is('[contenteditable]')) {
		const element = this[0];
		if (document.body.createTextRange) {
			const range = document.body.createTextRange();
			range.moveToElementText(element);
			range.select();
		}
		// select text
		else if (window.getSelection) {
			const selection = window.getSelection();
			const range = document.createRange();
			range.selectNodeContents(element);
			selection.removeAllRanges();
			selection.addRange(range);
		}
	}
};