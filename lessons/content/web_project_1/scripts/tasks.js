
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
	return function(url, preview, html) {
		if (url !== path) return;
		this.isValid = preview.find(selector).length === 1;
	}
}

// check for content 
export function expectElementContent(path, selector, min, max) {
	return function(url, preview, html) {
		if (url !== path) return;

		const text = _.trim(preview.find(selector).text());
		const length = text.length;
		const upper = (isNaN(max || NaN)) ? length + 1 : max;
		this.isValid = length > min && length < upper;
	}
}