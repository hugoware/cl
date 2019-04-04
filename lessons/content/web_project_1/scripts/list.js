
import { _, validateHtmlDocument } from './lib';
import createTasks from './controllers/task-list';
import * as tasks from './tasks';

export const controller = true;

// when activating a new 
export default createTasks(module.exports, {
	title: 'Create a product website for "Juice Fruit" smoothie shop!'
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


			task('Enter the title "Juice Fruit Smoothies"', {
				topic: 'Page Structure',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'head > title', { match: 'juice fruit smoothies' }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});


		task('Add the `/logo.png` image to `/index.html` ', () => {

			task('Create an `img` Element', {
				topic: 'HTML Attributes',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > img'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Set the `src` attribute to `/logo.png', {
				topic: 'HTML Attributes',
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
				onUpdatePreviewArea(url, html, preview) {
					if (url !== '/index.html') return;
					this.isValid = preview.find('body > img[src="/logo.png"]').length === 1;
				},
			});

		});

		task('Add a heading to `index.html`', () => {

			task('Create a `h1` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > h1'),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

			task('Place the `h1` Element after the `img` Element', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > img', 'body > h1'),
			});

			task('Enter a welcome message at least 10 characters long', {
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
				onUpdatePreviewArea: tasks.expectOrder('/index.html', 'body > h1', 'body > p'),
			});

			task('Enter a store description at least 15 characters long', {
				topic: 'Headings & Paragraphs',
				onUpdatePreviewArea: tasks.expectElementContent('/index.html', 'body > p', { min: 15 }),
				onRemoveFile: tasks.checkRemoveFile('/index.html'),
			});

		});

		function createImageLink(options) {

			task('Add a link to `' + options.path + '`', () => {

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

				task('Set the `href` attribute to `/index.html`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile('/index.html'),
					onUpdatePreviewArea(url, html, preview) {
						if (url !== '/index.html') return;
						this.isValid = preview.find('body > a[href="' + options.path + '"]').length === 1;
					},
				});

				task('Use the `' + options.imagePath + '` image as content', () => {

					task('Create an `img` Element inside of the link', {
						topic: 'HTML Attributes',
						onUpdatePreviewArea: tasks.expectElement('/index.html', 'body > a[href="' + options.path + '"] > img'),
						onRemoveFile: tasks.checkRemoveFile('/index.html'),
					});

					task('Set the `src` attribute to `' + options.imagePath + '`', {
						topic: 'HTML Attributes',
						onRemoveFile: tasks.checkRemoveFile('/index.html'),
						onUpdatePreviewArea(url, html, preview) {
							if (url !== '/index.html') return;
							this.isValid = preview.find('body > a[href="' + options.path + '"] > img[src="' + options.imagePath + '"]').length === 1;
						},
					});

				});

			});

		}


		createImageLink({ path: '/apple.html', imagePath: '/apple.png' });
		createImageLink({ path: '/cherry.html', imagePath: '/cherry.png' });
		createImageLink({ path: '/orange.html', imagePath: '/orange.png' });
		createImageLink({ path: '/pineapple.html', imagePath: '/pineapple.png' });


	});


	// creates a task for a new product page
	function createProductPage(options) {

		task('Create ' + (options.determiner || 'a') + ' `' + options.path + '` product page', () => {

			task('Use the **Create new file** button to add `' + options.path + '`', {
				onCreateFile: tasks.checkNewFile(options.path, true),
				onUploadFile: tasks.checkNewFile(options.path, false),
			});

			task('Add a title to `' + options.path + '`', () => {

				task('Create a `title` Element', {
					topic: 'Page Structure',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'head > title'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Use the title "' + options.title + '"', {
					topic: 'Page Structure',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'head > title', { match: options.title }),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

			});


			task('Add the `' + options.imagePath + '` image to `' + options.path + '` ', () => {

				task('Create an `img` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > img'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Set the `src` attribute to `' + options.imagePath + '`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile(options.path),
					onUpdatePreviewArea(url, html, preview) {
						if (url !== options.path) return;
						this.isValid = preview.find('body > img[src="' + options.imagePath + '"]').length === 1;
					},
				});

			});


			task('Add a paragraph to `' + options.path + '`', () => {

				task('Create a `p` Element', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > p'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Place the `p` Element after the `img` Element', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectOrder(options.path, 'body > img', 'body > p'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Describe the product with at least 15 characters', {
					topic: 'Headings & Paragraphs',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'body > p', { min: 15 }),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

			});


			task('Add a return link to `/index.html`', () => {

				task('Create an `a` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElement(options.path, 'body > a'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Place the link after the `p` Element', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectOrder(options.path, 'body > p', 'body > a'),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Enter at least 5 characters in the link', {
					topic: 'HTML Attributes',
					onUpdatePreviewArea: tasks.expectElementContent(options.path, 'body > a', { min: 5 }),
					onRemoveFile: tasks.checkRemoveFile(options.path),
				});

				task('Set the `href` attribute to `/index.html`', {
					topic: 'HTML Attributes',
					onRemoveFile: tasks.checkRemoveFile(options.path),
					onUpdatePreviewArea(url, html, preview) {
						if (url !== options.path) return;
						this.isValid = preview.find('body > a[href="/index.html"]').length === 1;
					},
				});

			});

		});

	}


	createProductPage({
		title: 'Amazing Apple',
		path: '/apple.html',
		imagePath: '/apple.png',
		determiner: 'an'
	});
	
	createProductPage({
		title: 'Cherry Crush',
		path: '/cherry.html',
		imagePath: '/cherry.png',
	});

	createProductPage({
		title: 'Outrageous Orange',
		path: '/orange.html',
		imagePath: '/orange.png',
		determiner: 'an'
	});

	createProductPage({
		title: 'Pineapple Perfection',
		path: '/pineapple.html',
		imagePath: '/pineapple.png',
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
					'/apple.html': false,
					'/cherry.html': false,
					'/orange.html': false,
					'/pineapple.html': false
				};
			}

			validateHtmlDocument(file.current, doc => {
				this.validation[file.path] = !doc.hasErrors;
				this.isValid = _.every(this.validation);
			});
		}
	});

});
