import { _ } from './lib';

export function checkNewFile(path, replaceContent) {
	return function(file) {
		if (file.path !== path) return;

		// creating a new file defaults to missing the title
		if (replaceContent)
			file.content = `<!DOCTYPE html>
<html>
	<head>

	</head>
	<body>

	</body>
</html>`;

		this.isValid = true;
	}
}


// check if a file was removed
export function checkRemoveFile(path) {
	return function(paths) {
		if (paths.indexOf(path) > -1)
			this.isValid = false;
	}
}


// helper functions
export function expectElement(path, selector) {
	return function(url, preview) {
		if (url !== path) return;
		this.isValid = preview.find(selector).length === 1;
	}
}

// check for content 
export function expectElementContent(path, selector, options) {
	const min = isNaN(options.min) ? 0 : options.min;
	const max = isNaN(options.max) ? Number.MAX_SAFE_INTEGER : options.max;

	return function(url, preview) {
		if (url !== path) return;

		// get the text length
		let text = preview.find(selector).text();
		if (options.trim !== false)
			text = _.trim(text);

		// check the result
		const length = text.length;
		this.isValid = length >= min && length <= max;
	}
}


// expect selectors in a certain order
export function expectOrder(path, ...selectors) {
	return function(url, preview) {
		if (url !== path) return;

		// make sure all elements are present
		const sequence = _.map(selectors, selector => preview.find(selector).index());

		// make sure each match is in the sequential order
		let hwm = -1;
		for (const index of sequence) {
			if (index === -1) {
				this.isValid = false;
				return;
			}

			if (index < hwm) {
				this.isValid = false;
				return;
			}

			hwm = index;
		}

		this.isValid = true;
	}
}

