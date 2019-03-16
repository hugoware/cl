
// import _ from 'lodash';
// import $css from 'scss-tokenizer';
// import * as $common from './common';

// // common setup functions
// const next = $common.createNextHandler({
// 	// onBeforeValidate: (instance, token) => {
// 	// 	console.log(token);
// 	// }
// });

// export default class CssValidator {

// 	constructor(css, options = { }) {
// 		this.tokens = $css.tokenize(css);
// 		this.index = 0;

// 		// check for format options
// 		this.shouldRemoveSpaces = !!options.removeAllSpaces;
// 		this.shouldRemoveComments = !options.maintainComments;
// 		this.strictSelectorOrder = !!options.strictSelectorOrder;

// 		// count up all lines and characters
// 		sumLines(this, css);
		
// 		// clean up line spacing
// 		fillSpaces(this.tokens);

// 		// trims the whitespace from the start and end
// 		// of each line, so the `.space()` check is limited
// 		// to spaces between values per line
// 		if (!this.shouldRemoveSpaces)
// 			trimWhitespace(this.tokens);

// 		// fix comments
// 		if (!this.shouldRemoveComments)
// 			removeComments(this.tokens);

// 		// perform remaining formatting and clean up
// 		finalizeTokens(this, this.tokens);

// 		// include the EOF value
// 		const last = this.tokens[this.tokens.length - 1];

// 		// get the indexes to work with
// 		let eofLine = last[4];
// 		let eofCol = last[5];
// 		if (isNaN(eofLine)) eofLine = last[2];
// 		if (isNaN(eofCol)) eofCol = last[3];

// 		// save the EOF token
// 		this.tokens.push(['eof', 'eof', eofLine, eofCol, eofLine, eofCol]);
// 	}

// 	// handles setting the error for this handler
// 	setError(type, token, message) {
// 		if (this.error) return;
// 		let [ t, v, startLine, startIndex, endLine, endIndex ] = token;

// 		// some values don't have ranges (newlines)
// 		if (isNaN(endLine)) endLine = startLine;
// 		if (isNaN(endIndex)) endIndex = startIndex;

// 		// calculate the position
// 		const startPosition = this.lineSums[startLine - 1] || 0;
// 		const endPosition = this.lineSums[endLine - 1] || 0;
// 		const start = (startPosition + startIndex) - 1;
// 		const end = (endPosition + endIndex);

// 		// write the error
// 		this.error = { type, line: startLine, start, end, message };
// 	}


// 	/** switches to optional mode for the next validator call */
// 	get optional() {
// 		this._optional = true;
// 		return this;
// 	}


// 	/** finds the start of the CSS code */
// 	start() {
// 		do {
// 			const token = this.tokens[this.index];
// 			if (token && token[0] === 'newline') {
// 				this.index++;
// 				continue;
// 			}

// 			// done working
// 			break;
// 		}
// 		while(true);

// 		return this;
// 	}


// 	/** checks if any value is a comment */
// 	comment(...args) {
// 		return next(this, 'comment', token => {
// 			const validator = $common.getValidator(args);
// 			const [type, value] = token;

// 			// not a comment type
// 			if (type !== 'comment')
// 				return `Expected comment: ${$common.oxfordize(args, 'or')}`;
			
// 			// make sure it matches
// 			if (!_.includes(args, value))
// 				return `Expected comment: ${$common.oxfordize(args, 'or')}`;

// 			// finally, check for a validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** runs to the end of the code */
// 	end(strict) {

// 		// has already called end
// 		if (this.hasEnded) return this.error;
// 		this.hasEnded = true;

// 		// without an error, check for finishing
// 		if (!this.error) {

// 			// auto finalize any remaining lines
// 			if (!strict)
// 				this.optional.newline();

// 			// make sure there's nothing left
// 			this.eof();
// 		}

// 		// give back the final result
// 		return this.error;
// 	}


// 	/** checks that the token is the last token */
// 	eof() {
// 		// already has an error
// 		if (this.error)
// 			return this;

// 		// check for an EOF
// 		return next(this, 'eof', token => {
// 			const [type] = token;
// 			if (type !== 'eof')
// 				return `Expected end of code`;
// 		});
// 	}

// 	// shortcut for newline test
// 	get $() {
// 		return this.newline();
// 	}

// 	// shortcut for optional newline test
// 	get $$() {
// 		return this.optional.newline();
// 	}

// 	// shortcut for using space
// 	get _() {
// 		return this.space();
// 	}

// 	// shortcut for using space
// 	get __() {
// 		return this.optional.space();
// 	}

// 	/** checks for a space character */
// 	space() {
// 		return next(this, 'space', token => {
// 			const [ type ] = token;
// 			if (type !== 'space')
// 				return `Expected space`;
// 		});
// 	}


// 	/** checks for a pseudo selector */
// 	pseudo(...args) {
// 		return next(this, 'pseudo', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type, value ] = token;
			
// 			// if it's not even a pseudo
// 			if (value[0] !== ':' || type !== 'pseudo')
// 				return `Expected pseudo selector: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid pseudo name
// 			value = _.toString(value).substr(1);
// 			if (!_.includes(args, value))
// 				return `Expected pseudo selector: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** check for a css rule definition */
// 	selector(...args) {
// 		return next(this, 'selector', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type, value ] = token;

// 			// selectors are kinda weird - check for words and idents
// 			if (type !== 'ident' && type !== 'word')
// 				return `Expected selector: ${$common.oxfordize(args, 'or')}`;

// 			// check for flexible matching or strict matching
// 			if (this.strictSelectorOrder) {

// 				// if it's not a valid class name
// 				if (!_.includes(args, value))
// 					return `Expected selector: ${$common.oxfordize(args, 'or')}`;

// 				// check for the validator
// 				if (validator)
// 					return validator(value);
// 			}

// 			// for flexible matching
// 			else {
// 				const provided = extractSelectors(value);
				
// 				// separate the value and the 
// 				for (let i = 0, total = args.length; i < total; i++) {
// 					const str = args[i];
// 					const expected = extractSelectors(str);
// 					const missing = _.difference(expected, provided);
// 					const extra = _.difference(provided, expected);

// 					// if there's no match, then display the
// 					// selector as is
// 					if (missing.length === expected.length)
// 						return `Expected selector: \`${str}\``;

// 					// check if missing expected selectors
// 					if (_.some(missing))
// 						return `Expected ${$common.pluralize(missing, 'selector', 'selectors')}: ${$common.oxfordize(missing, 'and')}`;
					
// 					// check for too many selectors
// 					if (_.some(extra))
// 						return `Unexpected ${$common.pluralize(extra, 'selector', 'selectors')}: ${$common.oxfordize(extra, 'and')}`;
// 				}

// 				// perform the validator, if needed
// 				if (validator)
// 					return validator(provided);

// 			}
// 		});
// 	}


// 	/** check for a css rule definition */
// 	rule(...args) {
// 		return next(this, 'rule', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type, value ] = token;

// 			// if it's not even a class
// 			if (type !== 'ident')
// 				return `Expected CSS rule: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid class name
// 			if (!_.includes(args, value))
// 				return `Expected CSS rule: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** checks for a symbol of some kind */
// 	symbol(...args) {
// 		return next(this, 'symbol', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type ] = token;

// 			// if it's not a valid class name
// 			if (!_.includes(args, type))
// 				return `Expected symbol: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(type);
// 		});
// 	}


// 	/** checks for a word value -- somewhat a generic string check */
// 	word(...args) {
// 		return next(this, 'word', token => {
// 			const validator = $common.getValidator(args);
// 			let [, value] = token;
			
// 			// since this is a generic type, this is going to
// 			// be flexible and just convert the value to a string
// 			value = _.toString(value);

// 			// if it's not a valid class name
// 			if (!_.includes(args, value))
// 				return `Expected : ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** checks for a numeric value */
// 	num(...args) {
// 		return next(this, 'number', token => {
// 			const validator = $common.getValidator(args);
// 			let [type, value] = token;

// 			// always convert to a number
// 			value = parseFloat(value);

// 			// if it's not even a number
// 			if (type !== 'number')
// 				return `Expected number: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid number
// 			if (!_.includes(args, value))
// 				return `Expected number: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** used to check for unit types */
// 	unit(...args) {
// 		return next(this, 'unit', token => {
// 			const validator = $common.getValidator(args);
// 			let [type, value] = token;

// 			// if it's not even a class
// 			if (type !== 'ident')
// 				return `Expected unit: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid class name
// 			if (!_.includes(args, value))
// 				return `Expected unit: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** checks for string values */
// 	str(...args) {
// 		let quote;

// 		// check for the leading quote
// 		this.symbol("'", '"', t => { quote = t; });

// 		// check for the string value
// 		next(this, 'string', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type, value ] = token;

// 			// if it's not even a class
// 			if (type !== 'string')
// 				return `Expected string: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid class name
// 			if (!_.includes(args, value))
// 				return `Expected string: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});

// 		// check for the trailing quote
// 		return this.symbol(quote);
// 	}


// 	/** checks for reserved CSS keywords */
// 	keyword(...args) {
// 		return next(this, 'keyword', token => {
// 			const validator = $common.getValidator(args);
// 			let [ type, value ] = token;

// 			// if it's not even a class
// 			if (type !== 'ident')
// 				return `Expected keyword: ${$common.oxfordize(args, 'or')}`;

// 			// if it's not a valid class name
// 			if (!_.includes(args, value))
// 				return `Expected keyword: ${$common.oxfordize(args, 'or')}`;

// 			// check for the validator
// 			if (validator)
// 				return validator(value);
// 		});
// 	}


// 	/** checks for one or many new lines */
// 	newline(strict) {
// 		let didFindNewline;

// 		do {
// 			const token = this.tokens[this.index];
// 			if (token && token[0] === 'newline') {
// 				didFindNewline = true;
// 				this.index++;

// 				// if this is the only line to check
// 				if (!!strict)
// 					break;

// 				// go to the next line
// 				continue;
// 			}

// 			// done working
// 			break;
// 		}
// 		while (true);

// 		// check for problems
// 		if (!didFindNewline && !this._optional) {
// 			const token = this.tokens[this.index];
// 			this.setError('newline', token, 'Expected a new line');
// 		}

// 		this._optional = false;
// 		return this;
// 	}

// }


// // breaks apart a css selector
// function extractSelectors(str) {
// 	const expanded = [];
// 	for (let i = 0, total = _.size(str); i < total; i++) {
// 		const char = str.charAt(i);
// 		if (char === '.' || char === '#') expanded.push(' ');
// 		expanded.push(char);
// 	}
// 	return _.trim(expanded.join('')).split(' ');
// }


// // normalizes the indexes for spaces since they aren't populated
// function fillSpaces(tokens) {
// 	let line;
// 	let position;
// 	for (let i = 0, total = tokens.length; i < total; i++) {
// 		const token = tokens[i];
// 		const [type, value] = token;

// 		// update the space character
// 		if (type === 'space') {
// 			token[2] = token[4] = line;
// 			token[3] = token[5] = position + 1;
// 			token[5] += (value.length - 1);
// 		}
// 		// reorient the position
// 		else {

// 			// doesn't have an ending range (for example, symbols)
// 			if (isNaN(token[4]) || isNaN(token[5])) {
// 				line = token[2];
// 				position = token[3] + _.toString(value).length - 1;
// 			}
// 			// use the ending position
// 			else {
// 				line = token[4];
// 				position = token[5];
// 			}
// 		}
// 	}
// }


// // check backwards by checking for the end comment
// // token -- if the start is never found, then the comment
// // will be ignored
// function removeComments(tokens) {
// 	let comment;

// 	for (let i = tokens.length; i-- > 0;) {
// 		const token = tokens[i];

// 		// attaches a comment
// 		if (token[0] === 'endComment')
// 			comment = [];

// 		// reached the start of the comment
// 		else if (token[0] === 'startComment') {
// 			token[0] = 'comment';
// 			token[1] = _.trim(comment.join(''));

// 			// remove the extra tokens
// 			tokens.splice(i + 1, Math.max(comment.length + 1, 0));

// 			// reset
// 			comment = null;
// 		}
// 		// there's an active comment - add the content
// 		else if (comment)
// 			comment.unshift(token[1]);
// 	}
// }


// // perform any extra adjustments and cleanup work
// function finalizeTokens(instance, tokens) {
// 	for (let i = tokens.length; i-- > 0;) {
// 		const token = tokens[i];
// 		const [type, value] = token;
// 		const after = tokens[i + 1];

// 		// seems like it might be a pseudo selector
// 		if (token[1] === ':' && after && after[0] === 'ident') {
// 			token[1] += after[1];
// 			token[4] = after[4];
// 			token[5] = after[5];
// 			token[0] = 'pseudo';

// 			// remove the prior item
// 			tokens.splice(i + 1, 1);
// 			continue;
// 		}

// 		// renaming certain types
// 		if (type === 'scssComment')
// 			token[0] = 'comment';

// 		// if this is a comment, we're going to
// 		// trim the whitespace
// 		if (type === 'comment')
// 			token[1] = _.trim(token[1]).replace(/^\/\/\W*/, '');

// 		// if this is a comment, we're going to
// 		// trim the whitespace
// 		if (value === '%')
// 			token[0] = 'ident';

// 	}

// 	// remove unused values
// 	for (let i = tokens.length; i-- > 0;) {
// 		const token = tokens[i];
// 		const [type] = token;

// 		// adjusting for unused values
// 		if ((type === 'space' && instance.shouldRemoveSpaces)
// 			|| (/comment/i.test(type) && instance.shouldRemoveComments)) {
// 			tokens.splice(i, 1);
// 			continue;
// 		}
// 	}
// }


// // clean up whitespace at the start of each line
// function trimWhitespace(tokens) {
// 	const total = tokens.length;
// 	let whitespaceIndex;
// 	let newlineIndex;
// 	for (let i = total; i-- > 0;) {
// 		const token = tokens[i];
// 		const [type] = token;

// 		// if this is a space character - mark it
// 		// since we'll trim it if we find a newline
// 		if (type === 'space') {

// 			// if its the first or last (minus one for the EOF token), just trim it
// 			if (i === 0 || i === (total - 1)) {
// 				tokens.splice(i, 1);
// 				continue;
// 			}

// 			// if we're actively trimming the end of
// 			// a line, just remove it now
// 			if (_.isNumber(newlineIndex)) {
// 				tokens.splice(i, newlineIndex - i);
// 				whitespaceIndex = null;
// 			}

// 			// check if we're tracking an
// 			// entirely new whitespace position
// 			else if (!_.isNumber(whitespaceIndex))
// 				whitespaceIndex = i;

// 		}
// 		// if this is a newline, we want to remove all
// 		// whitespace that's at the current position
// 		// to the whitespaceIndex
// 		else if (type === 'newline') {

// 			// mark that moving forward, all spaces should
// 			// be trimmed
// 			newlineIndex = i;

// 			// then also clear all items from this
// 			// position to the whitespace index
// 			if (!isNaN(whitespaceIndex)) {
// 				tokens.splice(i + 1, whitespaceIndex - i);
// 				whitespaceIndex = null;
// 			}
// 		}
// 		// since this isn't a newline and not
// 		// more spaces, we're going to clear
// 		// all of the flags for trimming
// 		else {
// 			whitespaceIndex = null;
// 			newlineIndex = null;
// 		}
// 	}
// }


// // count up line data
// function sumLines(instance, css) {
// 	instance.lineCounts = [];
// 	instance.lineSums = [0];
// 	_.each(css.split(/\n/g), (line, i) => {
// 		const total = line.length + 1;
// 		instance.lineCounts.push(total);
// 		instance.lineSums.push((instance.lineSums[i - 1] || 0) + total);
// 	});

// 	// fix newlines
// 	let line = 1;
// 	_.each(instance.tokens, token => {
// 		const [ type ] = token;
// 		if (type === 'newline') line++;
		
// 		// get the suspected line numbers so we 
// 		// can calculate any difference between the
// 		// two values so we can subtract as needed
// 		let endLine = token[4];
// 		if (isNaN(endLine)) endLine = token[2];
// 		if (isNaN(endLine)) endLine = 0;
		
// 		let startLine = token[2];
// 		if (isNaN(startLine)) startLine = 0;

// 		// assign the value
// 		token[2] = token[4] = line;
// 		token[4] += endLine - startLine;
// 	});

// }


// // shared eval function
// $common.createStaticEval(CssValidator);