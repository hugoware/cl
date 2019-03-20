
import _ from 'lodash';
import { getValidator, oxfordize , containsMatch} from './common';


export default class SyntaxValidator {

	constructor(code, params = { }) {;

		// config and setup
		this.code = code;
		this.params = params;
		this.reset();
	}

	// handles navigating forward through the code
	next(type, expression, action) {

		// get the current state
		const optional = this._optional;
		this._optional = false;

		// perform the test
		try {
			const match = this.remainingCode.match(expression);
			const value = match && match[0];

			// apply the match
			const error = action(value);
			if (error && !optional) {
				const end = this.index + _.size(value);
				this.setError(type, error, this.index, end);
			}

			// apply the adjustment
			const shouldApply = !error || (error && optional);
			if (shouldApply && _.some(value)) {
				this.index += value.length;
			}

		}
		// there was an error
		catch (ex) {
			console.log(ex);
			this.setError('exception', 'There was an error validating the code');
			// this.setError('exception', ex);
		}
		// this 
		finally {
			return this;
		}

	}

	/** attaches the error for this request */
	setError(type, message, start, end) {
		if (this.error) return this;

		// check for indexes
		start = isNaN(start) ? this.index : start;
		end = isNaN(end) ? this.index : end;

		// // check for better whitespace errors
		// const previous = this.code.charAt(start - 1);
		// if (previous === '\t')
		// 	message = 'Unexpected tab';
		// else if (previous === ' ')
		// 	message = 'Unexpected space';
		// else if (previous === '\n')
		// 	message = 'Unexpected new line';

		// save the error
		this.error = { type, message, start, end };
		this.hasError = true;
		return this;
	}

	/** navigates to an index */
	setBounds(start, end) {

		// single number used
		if (isNaN(end)) {
			end = start;
			start = 0;
		}

		if (end < start) {
			console.log('invalid bounding range');
			this.clearBounds();
			return this;
		}

		// create the ending bound
		end = _.clamp(end, start, this.length);
		this.bounds = { start, end };
		return this;
	}

	/** remove any test bounds */
	clearBounds() {
		delete this.bounds;
		return this;
	}

	/** start a test over */
	reset() {
		delete this.error
		delete this.hasError;
		delete this.bounds;

		// reset params
		this.options = { };
		this.index = 0; // this.bounds ? this.bounds.start : 0;
		this.length = _.size(this.code);
		this.meta = {};
		this.state = {
			stack: [ ]
		};

		return this;
	}

	/** executes any test passed in */
	merge(test) {
		test(this);
		return this;
	}

	/** used to track the progress of validation */
	progress(...args) {
		if (this.error) return this;

		// process each
		_.each(args, arg => {
			if (_.isString(arg))
				this.result.progress = arg;
			else if (_.isFunction(arg)) {
				const result = arg();
				if (!_.isNil(result))
					this.result.progress = result;
			}
		});

		return this;
	}

	/** includes extra data */
	append(obj, force) {
		if (!this.error || force)
			_.assign(this.meta, obj);
		return this;
	}

	// runs any starting logic
	start() { }

	// runs any ending logic
	end() { }

	// checks for a literal expression
	literal(expression, defaultError, validator) {
		return this.next('literal', expression, match => {
			if (!match)
				return defaultError;
			if (validator)
				return validator(match);
		});
	}

	/** handles a series of text values */
	seq(...phrases) {
		_.each(phrases, phrase => this.text(phrase));
		return this;
	}

	/** runs a test expecting the end of input */
	eof() {
		if (this.remainingCode !== '')
			this.setError('eof', 'Expected end of code');
		return this;
	}

	/** takes the current options state and resets */
	captureOptions() {
		const options = _.assign({ }, this.options);
		this.options = { };
		return options;
	}

	/** returns the code starting from the current index */
	get remainingCode() {
		let code = this.code;

		// check for limited bounding
		if (!!this.bounds) {
			let range = [ Math.max(this.bounds.start, 0) ];
			if (!isNaN(this.bounds.end))
				range.push(this.bounds.end - this.bounds.start);
			code = code.substr(...range);
		}

		// give back the active code
		return code.substr(this.index);
	}

	/** activates the optional flag */
	get optional() {
		this._optional = true;
		return this;
	}
	
	// helpful getters
	get _s() { return this.space(); }
	get _s$() { return this.optional.space(); }
	get __s() { return this.spaces(); }
	get __s$() { return this.optional.spaces(); }

	get _t() { return this.tab(); }
	get _t$() { return this.optional.tab(); }
	get __t() { return this.tab(true); }
	get __t$() { return this.optional.tab(true); }

	get _n() { return this.newline(); }
	get _n$() { return this.optional.newline(); }
	get __n() { return this.newline(true); }
	get __n$() { return this.optional.newline(true); }

	get _w() { return this.whitespace(); }
	get _w$() { return this.optional.whitespace(); }
	get __w() { return this.whitespace(true); }
	get __w$() { return this.optional.whitespace(true); }

	// captures lines until reaching a limit
	lines(min, max) {
		const remaining = this.remainingCode;
		const total = remaining.length;

		// max is the default value
		if (isNaN(max)) {
			max = min;
			min = 0;
		}

		// seek the next point
		let lines = 0;
		let jump = 0;
		for (let i = 0; i < total; i++) {
			const char = remaining.charAt(i);
			if (char === ' ' || char === '\t') continue;
			else if (char === '\n') {
				lines++;
				jump = i + 1;
				if (--max <= 0) break;
			}
			else break;
		}

		// move forward by the first
		this.index += jump;

		// if not enough
		if (lines < min)
			return this.setError('lines', `Expected new line`);

		return this;
	}

	// finds the next line with content -- starts at
	// the beginning of the line and not from the
	// first character
	get __b() {
		return this.lines();
	}

	// checks for spaces
	spaces() { return this.space(true); }
	space(multi = false) {
		return this.next('space', multi ? /^ +/ : /^ /, content => {
			if (!content)
				return `Expected space`;
		});
	}

	// checks for tabs
	tabs() { return this.tab(true); }
	tab(multi = false) {
		return this.next('tab', multi ? /^\t+/ : /^\t/, content => {
			if (!content)
				return `Expected tab`;
		});
	}

	// checks for newlines
	newlines() { return this.newline(true); }
	newline(multi = false) {
		return this.next('newline', multi ? /^\n+/ : /^\n/, content => {
			if (!content) {
				if (!this._optional) this.index--;
				return `Expected new line`;
			}
		});
	}

	// checks for whitespace
	whitespace(multi = false) {
		return this.next('whitespace', multi ? /^\s+/ : /^\s/, content => {
			if (!_.some(content))
				return `Expected whitespace`;
		});
	}

	// handles setting up the validator for use
	static setup(Validator) {
		Validator.validate = function (code, ...args) {

			// the first argument is special options
			let options = {};
			if (!_.isFunction(args[0]) && _.isObject(args[0]))
				options = args.shift();

			// instantiate and then test
			const test = new Validator(code, options);

			// set default states
			test.result = {};
			try {

				// check if starting the test automatically
				if (options.autoStart !== false)
					test.start();

				// run each action
				for (let i = 0, total = args.length; i < total; i++)
					args[i](test);

				// check for an auto end
				if (options.autoEnd !== false)
					test.end();

			}
			catch (ex) {
				console.log('EX', ex);
				test.error = {
					// message: 'There was an unexpected error parsing the code',
					message: ex.message,
					ex
				};
			}

			// attach the error, if any then
			// return the final result
			const result = test.result;

			// check for an error
			result.error = (test.getError ? test.getError() : test.error) || null;
			result.progress = result.progress || null;
			_.assign(result, test.meta);
			return result;
		};
	}

	// handles creating a next evaluator function
	static createNext(instance, func, options = { }) {
		const name = options.name || func;

		// create the params for the function generation
		const params = { 
			createMessage: options.message || ((args) => `Expected ${name}: ${oxfordize(args, 'or')}`)
		};

		// check for what to use
		if (!options.literal) {

			// check for match expression
			params.match = /^[^\s]+/;
			if (options.match)
				params.match = options.match;
			
			else if (options.match === 'next-token')
				params.match = /^[a-z0-9_\$]+/gi;
		}

		// loop search for next match
		if (options.scan) {
			params.scan = options.scan;
		}

		// copy other values
		params.after = options.after;
		params.defaultArgs = options.defaultArgs;
		params.ignoreCase = options.ignoreCase;

		// create the correct action
		const action = params.match ? createExpressionNext(func, params)
			: options.literal ? createLiteralNext(func, params)
			: params.scan ? createScanNext(func, params)
			: null;

		// can't create the action
		if (!action)
			throw `Missing action for ${func}`;

		// create the function
		instance.prototype[func] = function (...args) {
			if (this.hasError)
				return this;

			try {
				action.apply(this, args);
			}
			catch (ex) {
				console.log(ex);
				this.setError('ex', 'There was an error parsing this code');
			}
			finally {
				return this;
			}
		};

	}

}

function createScanNext(func, params) {

}

// creates a match for expressions
function createExpressionNext(func, params) {
	return function nextExpression(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions();

		// if no arguments are found
		if (args.length === 0)
			args = [].concat(params.defaultArgs || [ ]);
		
		// check for the next match
		this.next(func, params.match, token => {

			// was there a match and is it one of the arguments
			if (!_.isString(token) || !containsMatch(this, args, token, { caseSensitive: !options.ignoreCase, allowMatchFromStart: true }))
				return params.createMessage(args);

			// is there a validator
			if (validator)
				return validator(token);

			// before running next
			if (params.after)
				params.after(token, this);
		});
	}
}

// creates a literal match expression
function createLiteralNext(func, params) {
	return function nextExpression(...args) {
		const validator = getValidator(args);
		const options = this.captureOptions();

		// if no arguments are found
		if (args.length === 0)
			args = [].concat(params.defaultArgs || [ ]);
		
		// check for a match
		const match = _.find(args, arg => {
			let value = this.remainingCode.substr(0, arg.length);
			let compare = _.toString(arg);

			if (!!options.ignoreCase || params.ignoreCase) {
				value = _.toLower(value);
				compare = _.toLower(compare);
			}

			if (value === compare)
				return arg;
		});
		
		// did this have a match
		if (!match) {
			const message = params.createMessage(args);
			this.setError(func, message);
		}

		// check for a validator
		if (validator) {
			const message = validator(match);
			if (message)
				this.setError(func, message);
		}

		// before running next
		if (params.after)
			params.after(match, this);

		// move forward
		this.index += _.size(match);
	}
}