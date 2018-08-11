import $ from 'jquery';
import _ from 'lodash';

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

/** allows mapping css states using an object map 
	 * @param {Object<CSSClassName, boolean>} map the class names and boolean conditions
	*/
$.fn.toggleClassMap = function(map) {
	_.each(map, (state, css) => {
		this.toggleClass(css, state);
	});
	return this;
};

/** replaces a class value 
 * @param {string|RegExp} expression the expression to match to
 * @param {string|function} replacement the value or function to replace with
 * @returns {Component}
*/
$.fn.changeClass = function(expression, replacement = '') {

	// clean up the expression
	let exp = expression.toString();
	exp = exp.replace(/^\/?\^?/, '^');
	exp = exp.replace(/\/?[a-z]*\$?$/, '$');
	expression = new RegExp(exp, 'gi');

	// replace each one
	const cx = _.trim(this.attr('class')).split(/\s+/g);
	const total = cx.length;
	for (let i = total; i-- > 0;) {
		const value = cx[i];
		const shouldReplace = value.match(expression);

		// replace the segment, if possible
		if (shouldReplace)
			cx[i] = _.isFunction(replacement) ? replacement(value) : replacement;
	}

	// merge together
	const merged = cx.join(' ').replace(/\s+/, ' ');
	this.attr('class', merged);
	return this;
};