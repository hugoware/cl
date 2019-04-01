import { _, HtmlTagValidator } from '../lib';

// helper 
class FindResult {
	
	constructor(results) {
		this.results = results;
	}

	parents() {
		return _.map(this.results, 'parent');
	}

	total() {
		return _.size(this.results);
	}

	text() {
		return _.map(this.results.text).join(' ');
	}

	exists() {
		return this.total() > 0;
	}

	index() {
		return this.results[0] ? this.results[0].index : -1;
	}

	get(index) {
		return this.results[index];
	}

}

// const $cache = { };

export default class HtmlValidationHelper {

	// performs validation
	static validate(html, callback) {

		// // already cached
		// if ($cache[html])
		// 	return callback($cache[html]);

		// validate
		HtmlTagValidator(html, (err, ast) => {
			const validator = new HtmlValidationHelper(err, ast);
			callback(validator);
		});
	}
	
	constructor(err, ast) {
		this.err = err;
		this.ast = ast;
	}

	get hasError() {
		return !!this.err;
	}

	get hasErrors() {
		return this.hasError;
	}

	// finds the result of a selector
	find(selector) {
		if (this.hasErrors)
			return new FindResult([ ]);

		// prepare all nodes to track down
		if (!this.nodes) {
			this.nodes = [ ];
			flatten(this.ast, this.nodes);
		}

		// // clean up the selector first
		const parts = selector.split(/ +/g).reverse();
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

			// remove attribute matches
			value = value.replace(/\[[^\]]+\]/, attr => {
				const parts = attr.substr(0, attr.length - 1).substr(1).split('=');
				const name = parts[0];
				let value = parts[1];
				value = value.substr(0, value.length - 1).substr(1);
				match.attr = { name, value };
				return '';
			});


			// save the result
			match.value = value;
			parts[i] = match;
		}

		// check for each match
		const results = [ ];
		for (const node of this.nodes) {
			if (isMatch(node, [].concat(parts)))
				results.push(node);
		}

		return new FindResult(results);
	}

}

// check if this matches or not
function compareMatch(node, match) {
	const baseMatch = match.className ? _.trim((node.attributes && node.attributes['class']) || '').split(' ').indexOf(match.value) > -1
		: match.id ? ((node.attributes && node.attributes.id) || '') === match.value
		: match.value == node.name;

	if (!baseMatch) return false;

	// check for match
	if (match.attr) {
		return (node.attributes || { })[match.attr.name] === match.attr.value;
	}
	
	return true;
}

// matching all index values
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

			// ran out of items
			if (!match)
				break;

			// check for special rules
			if (match.value === '>') {
				nextOnly = true;
				match = parts.shift();
			}
		}

		// not a match
		const isMatch = compareMatch(compare, match);
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
		return found;

}


// creates a flat list
function flatten(node, list, track = { index: 0 }) {
	node.index = ++track.index;
	list.push(node);

	if (!node.name) {
		if (node.type === 'title')
			node.name = 'title';
	}

	const children = node.children || node.document;
	if (_.some(children)) {
		for (const child of children) {
			child.parent = node;
			flatten(child, list, track);
		}
	}
}