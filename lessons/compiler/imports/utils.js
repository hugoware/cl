import { _ } from './lib';


const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
const TOTAL_CHARACTERS = CHARACTERS.length;
export function randomString(length = 8, prefix) {
	let result = '';
	for (let i = 0; i < length; i++) {
	  result += CHARACTERS.charAt(Math.floor(Math.random() * TOTAL_CHARACTERS));
	}
	return (prefix || '') + result;
}

export function randomNumber(...args) {
	let min;
	let max;

	if (args.length === 1) {
		min = 0;
		max = args[0];
	}
	else { 
		min = args[0];
		max = args[1];
	}

	min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// finds a trimmed code boundary
export function findBoundary(code, options) {
	let index;

	// literal match
	if (_.isString(options.expression))
		index = code.indexOf(options.expression);

	// regular expression
	else if (_.isRegExp(options.expression)) {
		const match = options.expression.exec(code);
		index = match ? match.index : -1;
	}
	// just a number
	else if (_.isNumber(options.index)) {
		index = options.index;
	}

	// trim at the first newline
	let trim = 0;
	if (!!options.trimToLine) {
		
		while (true) {
			const char = code.charAt(index - ++trim);

			// whitespace, we can continue
			if (char === ' ' || char === '\t')
				continue;

			// if it's a newline, apply it
			if (char !== '\n')
				trim = 0;

			break;
		}

	}

	// // check for trimming
	// if (options.trim !== false) {
	// 	const range = _.trimEnd(code.substr(0, index));
	// 	index = range.length;
	// }
	
	if (isNaN(index))
		console.warn('find boundary: NaN');

	// return the final value
	return Math.max(-1, index - trim);
}


// creates a text/numeric only representation for a strin
export function simplify(str) {
	return (str || '').toString().replace(/[^a-z0-9]/gi, '').toLowerCase();
}


// checks for range messages
export function stringRange(value, min, max, asSingular, asPlural) {
	const num = !value ? 0
		: _.isNumber(value.length) ? value.length
		: value;

	if (num < min) {
		const diff = min - num;
		return `Expected ${diff} more ${diff > 1 ? asPlural : asSingular}`;
	}
	else if (num > max) {
		const diff = num - max;
		return `Expected ${diff} fewer ${diff > 1 ? asPlural : asSingular}`;
	}
}

// performs the oxford comma
export function oxfordize(items, conjunction, options = { }) {
	const total = items.length;
	if (!options.asLiteral)
		items = _.map(items, item => "`" + item.replace("`", '\\`') + "`");

	// determine the best
	if (total === 1)
		return items.join('')
	else if (total == 2)
		return items.join(` ${conjunction} `);

	// return the result
	else {
		const last = items.pop();
		return `${items.join(', ')}, ${conjunction} ${last}`;
	}
}

// pluralizes a word
export function pluralize(value, single, plural, none) {
	plural = plural || `${single}s`;
	none = none || plural;

	if (value === null || value === undefined) value = 0;
	if (!isNaN(value.length)) value = value.length;
	value = Math.abs(value);

	return value === 0 ? none
		: value === 1 ? single
		: plural;
}

// checks for string similarity
export function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0)
        costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue),
              costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0)
      costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}