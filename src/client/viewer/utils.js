import $ from 'cash-dom';

// helpers
export function isObject(obj) {
	return obj instanceof Object || typeof obj === 'object';
};

// gets a display value for an argument
export function getValue(obj) {
	if (obj === null && typeof obj === 'object') obj = 'null';
	else if (obj === undefined && typeof obj === 'undefined') obj = 'undefined';

	// check for complex values
	else if ($.isArray(obj) || isObject(obj))
		obj = JSON.stringify(obj, null, 2);

	return obj.toString();
}

// trims a string
export function trim(str) {
	return (str || '').toString().replace(/^(\n|\t|\s)*|(\n|\t|\s)*$/g, '');
}