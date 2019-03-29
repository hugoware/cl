
import { _, validateHtmlDocument } from './lib';
import createTasks from './controllers/task-list';
import * as tasks from './tasks';

export const controller = true;

// when activating a new 
export default createTasks(module.exports, {
	title: 'Create a small website'
}, 

// setup the main task
task => {

	task('Fix any validation errors', {

		onCreateTask() {
			this.validation = { };
			this.isValid = true;
		},

		onContentChange(file) {
			if (!this.validation) {
				this.validation = { };
			}

			validateHtmlDocument(file.current, html => {
				this.validation[file.path] = !html.hasErrors;
				this.isValid = _.every(this.validation);
			});
		}
	});

	task('Create an `index.html` page', () => {

		task('Create index.html', {
			onCreateFile: tasks.checkNewFile('/index.html', true),
			onUploadFile: tasks.checkNewFile('/index.html', false),
			onRemoveItems: tasks.checkRemoveFile('/index.html')
		});


		task('Add a page title', () => {

			task('Create the `title` Element', {
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});


			task('Enter between 5 and 20 characters in the title', {
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'head > title', 5, 20),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});

	});

	task('Create an `about.html` page', () => {

		task('Use **Create new file** button to add `about.html`', {
			onCreateFile: tasks.checkNewFile('/about.html', true),
			onUploadFile: tasks.checkNewFile('/about.html', false),
		});

		task('Add a page title', () => {

			task('Create a `title` Element', {
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter between 5 and 20 characters in the title', {
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'head > title', 5, 20),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add a page heading', () => {

			task('Create a `h1` Element', {
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter between 5 and 20 characters in the heading', {
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > h1', 5, 20),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add a page paragraph', () => {

			task('Create a `p` Element', {
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Place the `p` Element after the `h1` Element', {
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > h1').after('p').length === 1;
				}
			});

			task('Type at least 15 characters in the paragraph', {
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > p', 15, NaN),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add the `/cat.png` image', () => {

			task('Create an `img` Element', {
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Set the `src` attribute to `/cat.png`', {
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > img[src="/cat.png"]').length === 1;
				},
			});

		});


		task('Add a link from `/about.html` to `/index.html`', () => {

			task('Create an `a` Element', {
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Type at least 5 characters in the hyperlink', {
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > a', 15, NaN),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Set the `href` attribute to `/index.html`', {
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, preview, html) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
				},
			});

		});

	});

});
