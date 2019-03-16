import { oxfordize } from './common';

const _ = require('lodash');

/** quickly create an object map from a comma separated list */
export function toConst(str) {
	const map = { };
	_.each(str.split(/\s+/g), item => map[_.trim(item)] = true);
	return map;
}

/** captures if two strings are similar, but not the same 
 * @param {string} s1 the first string to test
 * @param {string} s2 the second string to test
 * @param {number?} minimumScore the minimum score to match - by default 0.8
 * @returns {boolean} is this a close enough match
*/
export function isSimilar(s1, s2, minimimScore = 0.8) {
	return getSimilarity(s1, s2) >= minimimScore;
}

/** returns how similar two string are to one another
 * @param {string} s1 The first string to compare
 * @param {string} s2 The second string to compare
 * @returns {number} The percentage similarty of the two strings
 */
export function getSimilarity(s1, s2) {

	if (_.isUndefined(s1)) s1 = '';
	if (_.isUndefined(s2)) s2 = '';

	s1 = s1.toString();
	s2 = s2.toString();
	
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

export function editDistance(s1, s2) {
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



// reads a string until finding a terminator character
export function gatherString(instance, options) {
	let { index } = instance;
	let isEscaping;
	let isMatch;

	// check for new line requirements
	if (!options.allowNewLine && !options.allowNewline)
		options.terminators.push('\n');

	// start the string hunt
	do {
		const char = instance.code.charAt(index);
		if (index >= instance.length)
			break;

		// check for stop characters
		if (!isEscaping) {

			// check for a match
			for (let i = 0; i < options.terminators.length; i++) {
				const terminator = options.terminators[i];
				const compare = instance.code.substr(index, terminator.length);

				// decide how far over to move
				if (compare === terminator) {
					options.didFindTerminator = true;
					isMatch = true;
					break;
				}
			}

			// found the match
			if (isMatch) {
				break;
			}
		}

		// move to the next character
		if (_.includes(options.escapes, char) && !isEscaping)
			isEscaping = true;

		// remove the escape
		else isEscaping = false;

		// next character
		index++;
	}
	while (true);

	// gather the phrase (remove one for the final match)
	const range = index - instance.index;
	const matched = instance.code.substr(instance.index, range);
	return matched;

}


// checks string arguments for good error messages
export function compareString(instance, args, options, phrase) {
	const startingPhrase = phrase;

	// check for new line requirements
	if (!options.allowNewLine || !options.allowNewline)
		options.terminators.push('\n');

	// start by trimming, if needed
	if (options.trim)
		phrase = _.trim(phrase);

	const hasPhrase = _.some(phrase);
	const hasArgs = _.some(args);

	// check for phrases that allow blanks
	if (!hasPhrase && options.allowEmpty)
		return;

	// they didn't provide arguments, they are expecting
	// just something to be in there
	if (!hasPhrase && !hasArgs)
		return `Expected content`;

	// check for min/max values
	if (_.isNumber(args[0])) {
		const len = phrase.length;
		const hasMax = _.isNumber(args[1]);

		// check min length
		const min = args[0];
		if (len < min) {
			const diff = min - len;
			return `Expected at least ${diff} more character${diff > 1 ? 's' : ''}`;
		}

		// check max length
		if (hasMax) {
			const max = args[1];
			if (len > max) {
				const diff = len - max;
				return `Expected ${diff} less character${diff > 1 ? 's' : ''}`;
			}
		}

		// ranges seem fine then
		return;

	}
	// checking string matches
	else if (hasArgs) {

		// convert case
		if (!options.matchCase)
			phrase = _.toLower(phrase);

		// check each match
		for (let compare of args) {
			if (!options.matchCase)
				compare = _.toLower(compare);

			// if it's a match, continue
			if (compare === phrase)
				return;

			// if it started with the correct value then the
			// match is there, but something else caused the
			// problem -- just backup and allow validation to 
			// continue from here
			if (!options.didFindTerminator) {
				if (hasPhrase && _.startsWith(phrase, compare)) {
					const backup = compare.length - phrase.length;
					instance.index -= backup;
					return;
				}
			}

		}

		// check each match
		for (let compare of args) {
			if (!options.matchCase)
				compare = _.toLower(compare);

			// start by checking if the phrase is found
			// at the start or end, but contains extra 
			// spacing that's not required
			const evalPhrase = _.toLower(_.trim(phrase));
			const simpleCompare = _.toLower(compare);

			// check that when simplified if they match
			if (evalPhrase === _.trim(simpleCompare)) {

				// since they match, check if the eval phrase
				// has spaces that aren't required
				const EMPTY = [''];
				const compareLead = (simpleCompare.match(/^ */) || EMPTY)[0].length;
				const compareTail = (simpleCompare.match(/ *$/) || EMPTY)[0].length;
				const evalLead = (phrase.match(/^ */) || EMPTY)[0].length;
				const evalTail = (phrase.match(/ *$/) || EMPTY)[0].length;

				if (compareLead > 0 && evalLead < compareLead)
					return `Expected space${compareLead - evalLead > 1 ? 's' : ''} at start`;

				if (evalLead > 0 && compareLead < evalLead)
					return `Unexpected space${evalLead - compareLead > 1 ? 's' : ''} at start`;

				if (compareTail > 0 && evalTail < compareTail)
					return `Expected space${compareTail - evalTail > 1 ? 's' : ''} at end`;

				if (evalTail > 0 && compareTail < evalTail)
					return `Unexpected space${evalTail - compareTail > 1 ? 's' : ''} at end`;
			}
		}

		// finally, just do a walk through the first string
		// to see if this 
		for (let compare of args) {
			for (let i = 0; i < Math.min(phrase.length, compare.length); i++) {
				if (compare[i] === ' ' && phrase[i] !== ' ')
					return 'Expected space';
			}
		}
		
		// if it's made it this far, then it didn't find a match to quit on
		return `Expected content: ${oxfordize(args, 'or')}`;
	}

}
