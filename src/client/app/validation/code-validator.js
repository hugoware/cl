import _ from 'lodash';
import SyntaxValidator from './base';
import {oxfordize, getValidator, containsMatch, pluralize} from './common';
import { gatherString, compareString } from './utils';


export default class CodeValidator extends SyntaxValidator {

	// set the trim state
	get trim() {
		this.options.trim = true;
		return this;
	}

	// sets if case matters
	get matchCase() {
		this.options.matchCase = true;
		return this;
	}

	// checks if newlines can be included
	get allowNewLine() {
		this.options.allowNewLine = true;
		return this;
	}

	// checks for a new comment
	commentStart(style, validator) {
		this.captureOptions();
		if (this.error) return this;

		// check that this matches
		const code = this.remainingCode.substr(0, style.length);
		if (code !== style)
			return this.setError('comment', `Expected start of comment: \`${style}\``);

		// move forward
		if (validator) {
			const error = validator(style);
			if (error)
				return this.setError('comment', error);
		}

		// move forward
		this.index += style.length;
		return this;
	}

	// checks for a new comment
	commentEnd(style, validator) {
		this.captureOptions();
		if (this.error) return this;

		// check that this matches
		const code = this.remainingCode.substr(0, style.length);
		if (code !== style)
			return this.setError('comment', `Expected end of comment: \`${style}\``);

		// move forward
		if (validator) {
			const error = validator(style);
			if (error)
				return this.setError('comment', error);
		}

		// move forward
		this.index += style.length;
		return this;
	}

	// check for a comment
	tmplStart(...args) {
		const options = this.captureOptions();
		if (this.error) return this;
		const validator = getValidator(args);

		// find the starting quote
		this.symbol('`');
		if (this.error) return this;

		// gather to the the template
		options.escapes = ['\\'];
		options.terminators = ['${'];
		const phrase = gatherString(this, options);
		this.index += _.size(phrase);

		// check the arguments
		const error = compareString(this, args, options, phrase);
		if (error)
			return this.setError('tmpl_start', error);
		
		// check the validator
		if (validator) {
			const error = validator(phrase);
			if (error)
				return this.setError('tmpl_start', error);
		}

		// now we need the template symbol
		this.startTemplateToken('${');
		
		return this;
	}

	// continues a template expecting another template
	tmplContinue(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions();
		if (this.error) return this;

		// immediately expect the closing symbol
		this.endTemplateToken('}');
		if (this.error) return this;

		// gather to the the template
		options.escapes = ['\\'];
		options.terminators = ['${'];
		const phrase = gatherString(this, options);
		this.index += _.size(phrase);

		// check the arguments
		const error = compareString(this, args, options, phrase);
		if (error)
			return this.setError('tmpl_continue', error);

		// check the validator
		if (validator) {
			const error = validator(phrase);
			if (error)
				return this.setError('tmpl_continue', error);
		}

		// now we need the template symbol
		return this.startTemplateToken('${');
	}

	// ends the template, expecing a close
	tmplEnd(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions();
		if (this.error) return this;

		// immediately expect the closing symbol
		this.endTemplateToken('}');
		if (this.error) return this;
		
		// gather to the the template
		options.escapes = ['\\'];
		options.terminators = ['`'];
		options.allowEmpty = !_.some(args);
		const phrase = gatherString(this, options);
		this.index += _.size(phrase);

		// check the arguments
		const error = compareString(this, args, options, phrase);
		if (error)
			return this.setError('tmpl_end', error);

		// check the validator
		if (validator) {
			const error = validator(phrase);
			if (error)
				return this.setError('tmpl_end', error);
		}

		// finally, we need the last token
		return this.symbol('`');
	}

	// check for a number match
	number(...args) {
		if (this.error) return this;

		const options = this.captureOptions();
		const validator = getValidator(args);
		return this.next('number', /^-?((0x)?[0-9]+\.?[0-9]*|Infinity|NaN)/, match => {

			// capture the value
			const strs = _.map(args, _.toString);
			const num = match === '-Infinity' ? -Infinity
				: match === 'Infinity' ? Infinity
				: match === '-NaN' ? -NaN
				: match === 'NaN' ? NaN
				: parseFloat(match);

			// check each arg
			if (_.some(args) && !_.includes(strs, match))
				return `Expected number: ${oxfordize(strs, 'or')}`;
				
			// check for custom validation
			if (validator)
				return validator(match, num);

		});
	}

	// checks for quotes
	string(...args) {
		const options = this.captureOptions();
		const validator = getValidator(args);
		if (this.error) return this;

		// maybe allow params
		const preferredQuotes = ["'"]; // , '"'];
		
		// get the leading quote
		let quote;
		this.symbol('"', "'", token => { quote = token; });
		if (this.hasError) {
			this.error.message = `Expected an opening quote: ${oxfordize(preferredQuotes, 'or')}`;
			return this;
		}

		// setup the terminator requirements
		options.escapes = ['\\'];
		options.terminators = [ quote ];

		// gather and check the string
		const phrase = gatherString(this, options);
		this.index += _.size(phrase);

		// check for errors
		const error = compareString(this, args, options, phrase);
		if (error)
			return this.setError('string', error);

		// check the validator
		const validated = validator && phrase && validator(phrase);
		if (!!validated)
			return this.setError('string', validated);

		// finally, needs the matching closing quote
		this.symbol(quote);
		if (this.hasError)
			this.error.message = `Expected a closing quote: \`${quote}\``;

		return this;
	}

	/** shortcut for a readability gap */
	gap() {
		return this._n.lines(1);
	}

}

SyntaxValidator.createNext(CodeValidator, 'id', { name: 'identifier', literal: true });
SyntaxValidator.createNext(CodeValidator, 'symbol', { literal: true });
SyntaxValidator.createNext(CodeValidator, 'operator', { literal: true });
SyntaxValidator.createNext(CodeValidator, 'keyword', { literal: true });
SyntaxValidator.createNext(CodeValidator, 'text', { literal: true });

SyntaxValidator.createNext(CodeValidator, 'boolean', { match: /^(true|false)/ });
// SyntaxValidator.createNext(CodeValidator, 'number', {
// 	// match: /^((0x)?[0-9]+\.?[0-9]*|Infinity|NaN)/
// 	match: /^[0-9]+/
// });

SyntaxValidator.createNext(CodeValidator, 'startTemplateToken', {
	literal: true,
	name: 'start of template'
});

SyntaxValidator.createNext(CodeValidator, 'endTemplateToken', {
	literal: true,
	name: 'end of template'
});


SyntaxValidator.createNext(CodeValidator, 'loop', {
	match: /^(for|while|do)/
});

SyntaxValidator.createNext(CodeValidator, 'declare', {
	match: /^(var|let|const)/,
	name: 'declared variable'
});

SyntaxValidator.createNext(CodeValidator, 'arg', {
	literal: true,
	name: 'argument'
});

SyntaxValidator.createNext(CodeValidator, 'assign', {
	name: 'assignment'
});

SyntaxValidator.createNext(CodeValidator, 'func', {
	literal: true,
	name: 'function call'
});

SyntaxValidator.createNext(CodeValidator, 'obj', {
	literal: true,
	name: 'object'
});

SyntaxValidator.setup(CodeValidator);
