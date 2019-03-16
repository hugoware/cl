import _ from 'lodash';


// // checks a token and moves forward by one
// export function createNextHandler(options = { }) {
// 	return (instance, type, compare) => {

// 		// clear the optional flag
// 		const isOptional = !!instance._optional;
// 		instance._optional = false;
		
// 		// there was already an error
// 		if (instance.error)
// 			return instance;

// 		// grab the token to work with
// 		let token = instance.tokens[instance.index];
// 		if (!token && options.onMissingToken)
// 			token = options.onMissingToken(instance.tokens[instance.index - 1]);

// 		// check for before event
// 		if (options.onBeforeValidate)
// 			options.onBeforeValidate(instance, token);
		
// 		// perform the test
// 		const error = compare(token);
// 		const hasError = _.isString(error);

// 		// check for after event
// 		if (options.onAfterValidate)
// 			options.onAfterValidate(instance, token);

// 		// had an error
// 		if (hasError && !isOptional) {
// 			instance.setError(type, token, error);
// 		}
// 		// no errors found
// 		else {

// 			// move forward
// 			if (!hasError)
// 				instance.index++;
// 		}

// 		return instance;
// 	};
// }


// finds a value in an array
export function getIndex(instance, collection, find, { caseSensitive = true, allowMatchFromStart = true } = { }) {
	collection = _.map(collection, caseSensitive ? _.toString : _.toLower);
	find = caseSensitive ? _.toString(find) : _.toLower(find);
	for (let i = 0, total = collection.length; i < total; i++) {
		const value = collection[i];
		if (value === find) return i;
		if (allowMatchFromStart && _.startsWith(find, value)) {
			instance.index -= find.length - value.length;
			return i;
		}
	}
	return -1;
}

// case sensitive comparisons
export function containsMatch(instance, collection, find, options) {
	return getIndex(instance, collection, find, options) > -1;
}


// nicely format labels
export function oxfordize(args, conjunction, skipCodify) {
	args = skipCodify ? args : _.map(args, arg => `\`${arg === '`' ? '\\`' : arg}\``);
	const { length } = args;

	if (length === 1)
		return args[0];

	else if (length === 2)
		return `${args[0]} ${conjunction} ${args[1]}`;

	else {
		args[length - 1] = `${conjunction} ${args[length - 1]}`;
		return args.join(', ');
	}

}

// returns a plural or singular version of a word
export function pluralize(source, singular, plural) {
	if (!plural) plural = `${singular}s`;
	const count = _.isNumber(source) ? source : _.size(source);
	return count > 1 ? plural : singular;
}

// quick exception thrown
export function ex(msg) {
	throw msg;
}

// checks for a validation function and returns it
// if any - also mutates the args if one is found
export function getValidator(args) {
	if (_.isFunction(args[args.length - 1]))
		return args.pop();
}

