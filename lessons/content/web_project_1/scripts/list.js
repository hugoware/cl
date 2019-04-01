
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


	task('Create an `index.html` page', () => {

		task('Use the **Create new file** button to add `index.html`', {
			onCreateFile: tasks.checkNewFile('/index.html', true),
			onUploadFile: tasks.checkNewFile('/index.html', false),
			onRemoveItems: tasks.checkRemoveFile('/index.html')
		});


		task('Add a title to `index.html`', () => {

			task('Create the `title` Element', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});


			task('Enter at least 5 characters in the title', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'head > title', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});

		task('Add a heading to `index.html`', () => {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Enter at least 10 characters in the heading', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > h1', { min: 10 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});

		task('Add a paragraph to `index.html`', () => {

			task('Create a `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Place the `p` Element after the `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/index.html') return;
					const header = preview.find('body > h1').index();
					const paragraph = preview.find('body > p').index();
					return this.isValid = header > -1 && paragraph > -1 && header < paragraph;
				}
			});

			task('Enter at least 15 characters in the paragraph', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});

		task('Add the `fox.png` image to `index.html`', () => {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Place the `img` Element between the `h1` and `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > h1', 'body > img', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/index.html')
			});

			task('Set the `src` attribute to `/fox.png`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > img[src="/fox.png"]').length === 1;
				},
			});

		});


		task('Add a link to `/about.html`', () => {

			task('Create an `a` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Place the link after the `p` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > p', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Enter at least 5 characters in the link', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > a', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Set the `href` attribute to `/index.html`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > a[href="/about.html"]').length === 1;
				},
			});

		});

	});

	task('Create an `about.html` page', () => {

		task('Use the **Create new file** button to add `about.html`', {
			onCreateFile: tasks.checkNewFile('/about.html', true),
			onUploadFile: tasks.checkNewFile('/about.html', false),
		});

		task('Add a title to `about.html`', () => {

			task('Create a `title` Element', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'head > title'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter at least 5 characters in the title', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'head > title', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add a heading to `about.html`', () => {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter at least 10 characters in the heading', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > h1', { min: 10 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add a paragraph to `about.html`', () => {

			task('Create a `p` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Place the `p` Element after the `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > h1', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter at least 15 characters in the paragraph', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

		});

		task('Add the `/cat.png` image', () => {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Place the `img` Element between the `h1` and `p` Elements', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > h1', 'body > img', 'body > p'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Set the `src` attribute to `/cat.png`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > img[src="/cat.png"]').length === 1;
				},
			});

		});


		task('Add a link to `/index.html`', () => {

			task('Create an `a` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/about.html', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Place the link after the `p` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectOrder('/about.html', 'body > p', 'body > a'),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Enter at least 5 characters in the link', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElementContent('/about.html', 'body > a', { min: 5 }),
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
			});

			task('Set the `href` attribute to `/index.html`', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/about.html'),
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/about.html') return;
					this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
				},
			});

		});

	});

	task('Fix all validation errors', {

		onCreateTask() {
			this.validation = { };
			this.isValid = false;
		},

		onContentChange(file) {
			if (!this.validation) {
				this.validation = {
					'/index.html': false,
					'/about.html': false
				};
			}

			validateHtmlDocument(file.current, doc => {
				this.validation[file.path] = !doc.hasErrors;
				this.isValid = _.every(this.validation);
			});
		}
	});

});
