
import { _ } from './lib';
import createTasks from './controllers/task-list';



function checkNewFile(path, replaceContent) {
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
function checkRemoveFile(path) {
	return function(paths) {
		if (paths.indexOf(path) > -1)
			this.isValid = false;
	}
}


// helper functions
function expectElement(path, selector) {
	return function(url, preview, html) {
		if (url !== path) return;
		this.isValid = preview.find(selector).length === 1;
	}
}

// check for content 
function expectElementContent(path, selector, min, max) {
	return function(url, preview, html) {
		if (url !== path) return;

		const text = _.trim(preview.find(selector).text());
		const length = text.length;
		const upper = (isNaN(max || NaN)) ? length + 1 : max;
		this.isValid = length > min && length < upper;
	}
}


createTasks(module.exports, {
	title: 'Create a small website'
}, 

// setup the main task
task => {

	task('Create an `index.html` page', () => {

		task('Create index.html', {
			onCreateFile: checkNewFile('/index.html', true),
			onUploadFile: checkNewFile('/index.html', false),
			onRemoveItems: checkRemoveFile('/index.html')
		});

		task('Fix all validation errors', {
			onUpdatePreviewArea(url, preview, html) {
				if (url !== '/index.html') return;
				this.isValid = !html.hasErrors;
			}
		});


		task('Add a page title', () => {

			task('Create the `title` Element', {
				onUpdatePreviewArea: expectElement('/index.html', 'head > title'),
				onRemoveFile: checkRemoveFile('/index.html'),
			});


			task('Enter between 5 and 20 characters in the title', {
				onUpdatePreviewArea: expectElementContent('/index.html', 'head > title', 5, 20),
				onRemoveFile: checkRemoveFile('/index.html'),
			});

		});

	});

	task('Create an `about.html` page', () => {

		task('Fix all validation errors', {
			onUpdatePreviewArea(url, preview, html) {
				if (url !== '/about.html') return;
				this.isValid = !html.hasErrors;
			}
		});

		task('Use **Create new file** button to add `about.html`', {
			onCreateFile: checkNewFile('/about.html', true),
			onUploadFile: checkNewFile('/about.html', false),
		});

		task('Add a page title', () => {

			task('Create a `title` Element', {
				onUpdatePreviewArea: expectElement('/about.html', 'head > title'),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Enter between 5 and 20 characters in the title', {
				onUpdatePreviewArea: expectElementContent('/about.html', 'head > title', 5, 20),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

		});

		task('Add a page heading', () => {

			task('Create a `h1` Element', {
				onUpdatePreviewArea: expectElement('/about.html', 'body > h1'),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Enter between 5 and 20 characters in the heading', {
				onUpdatePreviewArea: expectElementContent('/about.html', 'body > h1', 5, 20),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

		});

		task('Add a page paragraph', () => {

			task('Create a `p` Element', {
				onUpdatePreviewArea: expectElement('/about.html', 'body > p'),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Place the `p` Element after the `h1` Element', {
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > h1').after('p').length === 1;
				}
			});

			task('Type at least 15 characters in the paragraph', {
				onUpdatePreviewArea: expectElementContent('/about.html', 'body > p', 15, NaN),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

		});

		task('Add the `/cat.png` image', () => {

			task('Create an `img` Element', {
				onUpdatePreviewArea: expectElement('/about.html', 'body > img'),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Set the `src` attribute to `/cat.png`', {
				onRemoveFile: checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > img[src="/cat.png"]').length === 1;
				},
			});

		});


		task('Add a link from `/about.html` to `/index.html`', () => {

			task('Create an `a` Element', {
				onUpdatePreviewArea: expectElement('/about.html', 'body > a'),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Type at least 5 characters in the hyperlink', {
				onUpdatePreviewArea: expectElementContent('/about.html', 'body > a', 15, NaN),
				onRemoveFile: checkRemoveFile('/about.html'),
			});

			task('Set the `href` attribute to `/index.html`', {
				onRemoveFile: checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
				},
			});

		});

	});

});