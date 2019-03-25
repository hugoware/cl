import _ from 'lodash';
import SyntaxValidator from './base';
import { containsMatch, getIndex, oxfordize, getValidator } from './common';
import { gatherString, compareString } from './utils';
const SYMBOLS = ['.', '"', "'", ',', ';', '!', ','];

export default class CssValidator extends SyntaxValidator {

	constructor(...args) {
		super(...args);
		this.stack = [];
	}


	/** requires attributes to be in sequence */
	get matchPropOrder() {
		this.options.matchPropOrder = true;
		return this;
	}

	// matches the next prop name
	prop(...args) {
		const options = this.captureOptions();
		const validator = getValidator(args);
		return this.next('prop', /^[^ \n\t:]*/, match => {
			if (!_.includes(args, match))
				return `Expected property name: \`${oxfordize(args, 'or')}`;

			// custom validator
			if (validator) {
				const error = validator(match);
				if (error) return error;
			}
		});
	}

	// default declaration testing
	declare(...args) {

		const options = this.captureOptions();
		delete this.__previous__value__;

		// check for the type
		let map;
		if (args.length > 1)
			map = [args];

		// first collection
		else map = args[0];

		// if the sequence doesn't matter then we need
		// to sort this by name
		if (!options.matchPropOrder)
			map = _.sortBy(map, item => _.size(item[0])).reverse();

		// get each name to check
		const names = _.map(map, item => item[0]);
		const ignore = [];

		// check for a limit - otherwise
		// just use a number that won't be reached
		if (isNaN(options.limit))
			options.limit = 999;

		// determine how to proceed
		for (let i = 0, total = map.length; i < total; i++) {
			const isLast = (i + 1) === total;
			this._t;

			// must be in order
			let sequence;
			let sequenceIndex;
			if (options.matchPropOrder) {
				sequence = _.flatten(map[i]);
				sequenceIndex = i;
			}
			// find anything that matches
			else {
				for (let j = 0; j < total; j++) {
					const check = map[j][0];
					const isMatch = verifyNextProp(this, check);
					if (isMatch) {
						sequence = _.flatten(map[j]);
						sequenceIndex = j;
						break;
					}
				}
			}


			// if no sequence was found, this is an unexpected
			// attribute
			if (!sequence)
				return this.setError('props', `Expected property name: ${oxfordize(names, 'or')}`);

			// check if already added
			if (ignore.indexOf(sequenceIndex) > -1)
				return this.setError('props', `Duplicate property found: \`${name}\``, this.index, this.index + name.length);

			// since this worked, now check for it
			const name = sequence.shift();
			const validator = getValidator(sequence);

			// verify this is an exact match
			const isMatch = verifyNextProp(this, name);
			if (!isMatch)
				return this.setError('props', `Expected property name: \`${name}\``, this.index, this.index + name.length);

			// move forward the match length
			else this.index += name.length;

			// if that's all (no values) stop here
			if (sequence.length === 0)
				continue;

			// equal sign
			this._s$.symbol(':')._s;

			// checking the value
			if (this.error) return this;
			
			// internal testing logic
			if (_.isFunction(sequence[0])) {
				const startAt = this.index;
				sequence[0](this);

				// save the matched string
				this.__previous__value__ = this.code.substr(startAt, startAt - this.index);
			}
			// expression test
			else if (_.isRegExp(sequence[0])) {

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
					return this.setError('declare', error);
			}

			// checking the ending quote
			if (this.error) return this;
			this.symbol(';');

			// add the newline
			if (!isLast)
				this.newline();

			// completely successful, remove this
			// sequence from the group
			const index = names.indexOf(name);
			names.splice(index, 1);
			ignore.push(sequenceIndex);

			// check if we have enough matches
			if (i >= options.limit)
				break;

		}

		return this;
	}

	block() {
		return this._s.symbol('{')._n;
	}

	endBlock() {
		return this.symbol('}');
	}

	// alias for another name
	endQuote(...args) {
		return this.closeQuote(...args);
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


// checks that the next prop is only that
function verifyNextProp(instance, check) {
	const len = _.size(check) || 0;
	if (isNaN(len) || len <= 0) return false;

	// check the match
	const code = instance.remainingCode;
	const grab = code.substr(0, len);
	const after = code.charAt(len);
	const isPropDelimeter = _.size(after) === 0 ? true : /( |:|\n|\t)/.test(after);
	return grab === check && isPropDelimeter;
}


SyntaxValidator.createNext(CssValidator, 'selector', {
	literal: true,
	matchCase: true,
	name: 'selector'
});

// SyntaxValidator.createNext(CssValidator, 'tag', {
// 	literal: true,
// 	matchCase: true,
// 	name: 'tag selector'
// });

// SyntaxValidator.createNext(CssValidator, 'cls', {
// 	literal: true,
// 	matchCase: true,
// 	name: 'class selector'
// });

// SyntaxValidator.createNext(CssValidator, 'id', {
// 	literal: true,
// 	matchCase: true,
// 	name: 'id selector'
// });

SyntaxValidator.createNext(CssValidator, 'font', {
	literal: true,
	matchCase: false,
	name: 'font'
});

SyntaxValidator.createNext(CssValidator, 'value', {
	literal: true,
	matchCase: true,
	name: 'value',
	after: (match, test) => test.__previous__value__ = match
});

SyntaxValidator.createNext(CssValidator, 'color', {
	literal: true,
	matchCase: false,
	name: 'color'
});

SyntaxValidator.createNext(CssValidator, 'px', {
	literal: true,
	matchCase: true,
	name: 'px'
});

SyntaxValidator.createNext(CssValidator, 'percent', {
	literal: true,
	matchCase: true,
	name: 'percent'
});

SyntaxValidator.createNext(CssValidator, 'degree', {
	literal: true,
	matchCase: true,
	name: 'degree'
});

SyntaxValidator.createNext(CssValidator, 'num', {
	literal: true,
	matchCase: true,
	name: 'number'
});

// SyntaxValidator.createNext(CssValidator, 'prop', {
// 	literal: true,
// 	matchCase: true,
// 	name: 'property'
// });

SyntaxValidator.createNext(CssValidator, 'keyword', {
	literal: true,
	matchCase: true,
	name: 'keyword'
});

SyntaxValidator.createNext(CssValidator, 'symbol', {
	literal: true,
	matchCase: true,
	name: 'symbol'
});

SyntaxValidator.createNext(CssValidator, 'quote', {
	name: 'opening quote',
	match: /^("|')/,
	defaultArgs: ['"'],
	after: (match, test) => test.__previous__quote__ = match
});

SyntaxValidator.setup(CssValidator);
