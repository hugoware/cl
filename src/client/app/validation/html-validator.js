import _ from 'lodash';
import SyntaxValidator from './base';
import { containsMatch, getIndex, oxfordize, getValidator } from './common';
import {gatherString, compareString} from './utils';
const SYMBOLS = ['.', '"', "'", ',', ';', '!', ','];


export default class HtmlValidator extends SyntaxValidator {

	constructor(...args) {
		super(...args);
		this.stack = [ ];
	}

	/** activates the trim option */
	get singleLine() {
		this.options.singleLine = true;
		return this;
	}

	/** requires attributes to be in sequence */
	get matchAttributeSequence() {
		this.options.matchAttributeSequence = true;
		return this;
	}

	/** activates the trim option */
	get trim() {
		this.options.trim = true;
		return this;
	}

	/** accepts any whitespace */
	get anyWhitespace() {
		this.options.anyWhitespace = true;
		return this;
	}

	/** checks if case sensitivity is important */
	get caseSensitive() {
		this.options.caseSensitive = true;
		return this;
	}

	/** checks if case sensitivity is important */
	get rejectNewLineInContent() {
		this.options.rejectNewLineInContent = true;
		return this;
	}


	/** checks for a new doctype */
	doctype(...attrs) {
		this.open('doctype');

		// include attributes
		if (_.some(attrs))
			this._s.dattrs(...attrs).__s$;

		return this.close('doctype');
	}

	/** checks for individual doc type arguments */
	dattrs(...args) {
		const total = _.size(args);
		_.times(total, i => {
			if (this.error) return;

			// check for the next attribute
			const expects = args[i];
			const attr = this.remainingCode.substr(0, expects.length);

			// complain
			if (attr !== expects)
				return this.setError('doctype', `Expected doctype attribute: \`${expects}\``, this.index, this.index + attr.length);

			// shift forward
			this.index += attr.length;

			// check for a space
			if ((i + 1) !== total)
				this.space();
		});

		return this;
	}

	/** checks for an simple tag <tag> */
	tag(...args) {
		return this.open(...args).close('>');
	}

	/** starts checking for the next open tag */
	open(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions(this);

		// check for special
		const isDoctype = /doctype/i.test(args[0]);

		// check for the opening bracked
		this.next('open-tag-symbol', /^\</, match => {
			if (!match)
				return `Expected ${isDoctype ? 'a DOCTYPE' : 'a tag'}: \`<\``;
		});

		// check for the doctype start, if needed
		if (isDoctype)
			this.next('doctype-start', /^\!/, match => {
				if (!match)
					return `Expected a DOCTYPE: \`!\``;
			});

		// check for the tag name
		let tag;
		this.next('open-tag-name', /^[a-z0-9\-_]+/i, match => {
			tag = match;

			// checking for doctypes
			if (isDoctype && tag !== 'DOCTYPE')
				return `Expected uppercase doctype: \`DOCTYPE\``;

			// doesn't have the tag
			if (!isDoctype && !(tag && containsMatch(this, args, tag, { caseSensitive: !!options.caseSensitive, allowMatchFromStart: true })))
				return `Expected opening tag: ${oxfordize(args, 'or')}`;

			// check the validator
			if (validator)
				return validator(tag);
		});

		// if this worked, we're in a new tag
		if (!this.error) {
			this.stack.push(tag);
			this.is_opening_tag = true;
		}

		return this;
	}

	/** handles checking for a close tag */
	close(...args) {
		const options = this.captureOptions(this);
		const validator = getValidator(args);
		const isBasicClose = args[0] === '>';
		const isSelfClose = args[0] === '/>';
		const isDoctype = args[0] === 'doctype';

		// new tag was closed immediately
		if (isSelfClose) {
			this.next('open-end-slash', /^\//, close => {
				if (!close)
					return `Expected self closing tag: \`/>\``;
			});

			this.next('open-end-bracket', /^\>/, close => {
				if (!close)
					return `Expected self closing tag: \`>\``;

				if (validator)
					return validator(close);
			});

			// closed itself, pop this tag
			this.stack.pop();
		}
		// a new tag has been started
		else if (isDoctype || isBasicClose) {
			this.next('open-end-symbol', /^\>/, close => {
				if (!close)
					return `Expected close of ${isDoctype ? 'doctype' : 'new tag'}: \`>\``;

				if (validator)
					return validator(close);
			});

			// for doctypes, this closes it
			if (isDoctype)
				this.stack.pop();
		}
		// checking for the pair of a closing tag
		else {
			this.next('close-tag-start', /^\</, close => {
				if (!close)
					return `Expected closing tag: \`<\``;
			});

			this.next('close-tag-slash', /^\//, close => {
				if (!close)
					return `Expected closing tag: \`/\``;
			});

			// check the actual name
			let name;
			this.next('close-tag-name', /^[a-z0-9\-\_]+/, close => {
				if (!close || !containsMatch(this, args, close, { caseSensitive: !!options.caseSensitive, allowMatchFromStart: true }))
					return `Expected closing tag: ${oxfordize(args, 'or')}`;
				name = close;
			});

			this.next('close-tag-end', /^>/, close => {
				if (!close)
					return `Expected closing tag: \`>\``;
			});

			// check for custom validators
			if (!this.error && validator) {
				const message = validator(name);
				if (message)
					this.setError('close-tag', message);
			}

			// closing the tag, remove it from the stack
			this.stack.pop();
		}

		return this;
	}

	/** checks for a range of text */
	text(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions(this);

		// check each substring for a match
		for (let i = 0; i < args.length; i++) {
			let expects = args[i];
			let phrase = this.remainingCode.substr(0, expects.length);

			// match case, if needed
			if (!options.caseSensitive) {
				expects = _.toLower(expects);
				phrase = _.toLower(phrase);
			}

			// this was a successful match
			if (phrase === expects) {
				this.index += expects.length;

				// run the validator
				if (validator) {
					const error = validator(phrase);
					if (error)
						this.setError('text', error);
				}

				return this;
			}
		}

		// convert args to make sense
		const allSymbols = _.filter(args, item => SYMBOLS[item]).length === args.length;
		const message = args[0] === ' ' ? `Expected space`
			: /\n/.test(args[0]) ? `Expected new line`
			: /\t/.test(args[0]) ? `Expected tab`
			: `Expected ${allSymbols ? 'symbol' : 'text'}: ${oxfordize(args, 'or')}`;

		// no match was found
		this.setError('text', message);
		return this;
	}

	// // expects a series of matching parts
	// seq(...parts) {

	// 	// start matching each item
	// 	for (let i = 0; i < parts.length; i++) {
	// 		const phrase = _.isArray(parts[i]) ? parts[i] : [parts[i]];
	// 		this.text(...phrase);
	// 		if (this.error) break;
	// 	}

	// 	return this;
	// }

	/** checks for a content range */
	content(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions(this);

		options.terminators = [ '<' ];

		// check for newline handling
		options.allowNewLine = true;
		if (options.rejectNewLineInContent || options.singleLine)
			options.allowNewLine = false;

		// gather and check the string
		const phrase = gatherString(this, options);
		this.index += _.size(phrase);

		// perform the comparison
		const error = compareString(this, args, options, phrase);
		if (error)
			return this.setError('string', error);

		// check the validator
		const validated = validator && phrase && validator(phrase);
		if (!!validated)
			return this.setError('string', validated);

		// nudge forward
		return this;
	}

	// finds a collection of attributes
	attrs(...args) {
		const options = this.captureOptions();
		delete this.__previous__value__;

		// check for the type
		let map;
		if (args.length > 1)
			map = [ args ];

		// first collection
		else map = args[0];

		// get each name to check
		const names = _.map(map, item => item[0]);
		const ignore = [ ];

		// determine how to proceed
		for (let i = 0, total = map.length; i < total; i++) {
			
			// must be in order
			let sequence;
			let sequenceIndex;
			if (options.matchAttributeSequence) {
				sequence = _.flatten(map[i]);
				sequenceIndex = i;
			}
			// find anything that matches
			else {
				for (let j = 0; j < total; j++) {
					const check = map[j][0];
					if (!check) continue;
					if (check === this.remainingCode.substr(0, check.length)) {
						sequence = _.flatten(map[j]);
						sequenceIndex = j;
						break;
					}
				}
			}

			// if no sequence was found, this is an unexpected
			// attribute
			if (!sequence)
				return this.setError('attrs', `Expected attribute name: ${oxfordize(names, 'or')}`);

			// check if already added
			if (ignore.indexOf(sequenceIndex) > -1)
				return this.setError('attrs', `Duplicate attribute found: \`${name}\``, this.index, this.index + name.length);

			// since this worked, now check for it
			const name = sequence.shift();
			const validator = getValidator(sequence);
			this.attr(name);
			if (this.error) return this;

			// if that's all (no values) stop here
			if (sequence.length === 0)
				continue;
			
			// equal sign
			this.eq();
			
			// checking the quote
			if (this.error) return this;
			this.quote();
			
			// checking the value
			if (this.error) return this;
			if (_.isRegExp(sequence[0])) {

				// check the expression
				const expression = sequence[0];
				expression.lastIndex = 0;
				const match = this.remainingCode.match(expression);

				// failed to match
				if (!match)
					return this.setError('value', sequence[1]);

				// capture the match
				this.__previous__value__ = match;

				// since it worked, we need to move forward
				this.index += match[0].length;
			}
			// checking for a value
			else this.value.apply(this, sequence);

			// check for a validator since it's only
			// valid after the value has been found
			if (this.error) return this;
			if (validator) {
				const error = validator(this.__previous__value__, this);
				delete this.__previous__value__;
				if (error)
					return this.setError('attr', error);
			}

			// checking the ending quote
			if (this.error) return this;
			this.closeQuote();

			// if not the last value, expect a single space
			if (i < (total - 1))
				this._s;

			// completely successful, remove this
			// sequence from the group
			const index = names.indexOf(name);
			names.splice(index, 1);
			ignore.push(sequenceIndex);

		}

		return this;
	}

	// checks for a closing quote
	closeQuote(...args) {
		const validator = getValidator(args);
		return this.next('close-quote', /^("|')/, match => {
			const quote = this.__previous__quote__;
			delete this.__previous__quote__;

			// no quote was found
			if (!quote)
				return 'Unexpected closing quote';

			// not any kind of quote
			if (!match || match !== quote)
				return `Expected closing quote: \`${quote || '"'}\``;

			// check the validator
			if (validator) {
				const error = validator(match);
				if (error) return error;
			}
		});
	}

}


SyntaxValidator.createNext(HtmlValidator, 'attr', {
	literal: true,
	matchCase: true,
	name: 'attribute name'
});

SyntaxValidator.createNext(HtmlValidator, 'value', {
	literal: true,
	name: 'attribute value',
	after: (match, test) => test.__previous__value__ = match
});

SyntaxValidator.createNext(HtmlValidator, 'eq', {
	defaultArgs: [ '=' ],
	literal: true,
	name: 'attribute assignment'
});

SyntaxValidator.createNext(HtmlValidator, 'quote', {
	name: 'opening quote',
	match: /^("|')/,
	defaultArgs: [ '"' ],
	after: (match, test) => test.__previous__quote__ = match
});

// SyntaxValidator.createNext(HtmlValidator, 'text', { literal: true });

SyntaxValidator.setup(HtmlValidator);
