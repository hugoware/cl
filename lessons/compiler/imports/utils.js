import { _ } from './lib';

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
export function oxford(items, conjunction) {
	const total = items.length;

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
export function plural(count, single, plural, none, delimeter = '@') {
	const value = Math.abs(count);
	const message = value === 1 ? single
		: value > 1 ? (plural ? plural : `${single}s`)
			: none || plural;
	return message.replace(delimeter, count);
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