import _ from 'lodash';

export default class HtmlValidationHelper {
	
	constructor(err, ast) {
		this.err = err;

		// can't do anything else with an error
		if (err) {
			console.log(err);
			return;
		}

		// create a flat array of nodes
		this.ast = ast;
		this.nodes = [ ];
		flatten(this.ast, this.nodes);
	}

	get hasError() {
		return !!this.err;
	}

	get hasErrors() {
		return this.hasError;
	}

	// finds the result of a selector
	find(selector) {

		// clean up the selector first
		const parts = selector.split(/s+/g).reverse();
		for (let i = 0, total = parts.length; i <	total; i++) {
			const match = { };

			// check anything about this match
			let value = parts[i];
			const lead = value.charAt(0);

			// check for special selectors
			if (lead === '.') {
				match.className = true;
				value = value.substr(1);
			}
			else if (lead === '#') {
				match.id = true;
				value = value.substr(1);
			}

			// direct child selectors
			if (value === '>') {
				match.direct = true;
			}

			// save the result
			match.value = value;
		}


		// check for each match
		for (const node of this.nodes) {
			if (isMatch(node, [].concat(parts)))
				results.push(node);
		}
	}

}

// check if this matches or not
function compareMatch(node, options) {
	return (options.className && _.trim(node.attributes['class']).indexOf(options.value) > -1)
		|| (options.id && node.attributes.id === options.value)
		|| (options.value == node.name);
}

function isMatch(node, parts) {
	let match = parts.shift();
	let nextOnly;
	let found;

	// check that this matches the selector
	if (!compareMatch(node, match))
		return;

	// clear the match
	found = node;
	match = null;

	// walk up the selector
	let compare = found.parent;
	do {

		// nothing to compare against
		if (!compare) 
			return;

		// check the next match
		if (!match) {
			match = parts.shift();
			nextOnly = false;

			// check for special rules
			if (match.value === '>') {
				nextOnly = true;
				match = parts.shift();
			}
		}

		// not a match
		const isMatch = compareMatch(match, compare);
		if (nextOnly && !isMatch)
			return;

		// since it's not the end, keep going up
		if (isMatch) {
			compare = compare.parent;
			match = null;

			// check if finished
			if (parts.length === 0)
				break;
		}

	}
	while(true);

	// keep the result
	if (parts.length === 0)
		results.push(found);

}


// creates a flat list
function flatten(node, list) {
	list.push(node);

	if (node.children) {
		for (const child of node.children) {
			child.parent = node;
			flatten(child, list);
		}
	}
}