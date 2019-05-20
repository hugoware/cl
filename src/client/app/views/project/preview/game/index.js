/// <reference path="../../../../types/index.js" />

// import { _, $, HtmlTagValidator } from '../../../../lib';
// import View from './view';
import $state from '../../../../state';
import $contentManager from '../../../../content-manager';
import Component from '../../../../component';
import { getExtension } from '../../../../utils/index';
import $errorManager from '../../../../error-manager';


// create the preview mode
export default class GameMode extends Component {

	constructor(preview) {
		super({
			template: 'preview-game',

			ui: {
				runCode: '.run-scripts',
				viewport: '.viewport',
				output: '.game',
				console: '.console .messages'
			}
		});

		// save the preview instance
		this.preview = preview;
		this.listen('window-resize', this.onResize);

		// handle executing code
		Mousetrap.bind('mod+enter', this.onRunCode);

		// log messages
		this.consoleMessages = [ ];

		// game system messages
		window.__matchViewportSize__ = this.setViewportSize;
		window.__logGameMessage__ = this.onLogMessage;
		window.__clearGameMessages__ = this.onClearMessages;

		this.ui.runCode.on('click', this.onRunCode);
	}

	// saves the viewport size to use
	setViewportSize = () => {
		this.syncViewport();
	}

	// handles syncing the viewport with the size
	syncViewport = () => {
		const target = Component.bind(this.context.document.body).find('canvas');
		const area = this.ui.viewport[0].getBoundingClientRect();
		const size = target[0].getBoundingClientRect();
		const height = (area.bottom - area.top) - (size.bottom - size.top);

		this.ui.console.height(height);
		this.ui.console[0].scrollTop = Number.MAX_SAFE_INTEGER;
	}

	onLogMessage = (...args) => {
		this.consoleMessages.push(args.join(' '));
		if (this.consoleMessages.length > 200)
			this.consoleMessages.shift();
		
		// update the log
		const messages = this.consoleMessages.join('\n');
		this.ui.console.text(messages);
	}

	onClearMessages = () => {
		this.consoleMessages.length = 0;
		this.onLogMessage('');
	}

	onResize = () => {
		this.syncViewport();
	}

	// handle activation
	onActivateProject = () => {
		this.isActive = true;
		this.render();
	}

	onDeactivateProject = () => {
		this.isActive = false;
		this.writeContent('');	
	}

	// switched files
	onActivateFile = file => {
		this.activeFile = file;
	}

	onCloseFile = () => {

	}

	onCompileFile = () => {
		// clearTimeout(this.pending);
		// this.pending = setTimeout(this.render, 1000);
	}

	// activates the code
	onRunCode = () => {
		if (!this.isActive) return;
		// this.consoleMessages = [ ];
		// this.onLogMessage('Starting game...');
		this.writeContent('');
		setTimeout(this.render, 100);
	}

	render = async () => {

		// compile the javascript file
		// compile the code -- save any errors
		// directly to the runner. When `.run` is called
		// that error will be thrown right away
		let ex;
		await $contentManager.compile('/main.js', {
			onError: error => ex = error,
			silent: true
		});

		// get the code to execute
		const code = await $contentManager.get('/main.js');
		const domain = $state.getProjectDomain();

		const markup = `<!DOCTYPE html>
			<html>
			<head>
				<base href="${domain}" />
				<link rel="stylesheet" href="/__codelab__/game.css">
				<script src="/__codelab__/game.js" ></script>
				<script src="https://unpkg.com/phaser@3.16.2/dist/phaser.min.js" ></script>
				<script src="https://unpkg.com/phaser@3.16.2/dist/phaser-arcade-physics.min.js"></script>
			</head>
			<body>
				<style type="text/css" >
					#game-container {
						position: fixed;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
					}
					
					#game-view {
						width: 100%;
						height: 100%;
					}

					#game-view canvas {
						position: relative;
						left: 50%;
						top: 0;
						transform: translate(-50%, 0);
					}
				</style>

				<div id="game-container" >
					<div id="game-view" ></div>
				</div>

				<script>
					document.domain = window.location.hostname;
					(function() { 
						window.activateGame = function() {
							${code}
						};
					})();

					window.addEventListener('load', launchGame);
				</script>
			</body>
			</html>`;

		this.writeContent(markup);
	}

	/** access to the output window
	 * @type {HTMLElement} the preview DOM element
	 */
	get output() {
		return this.context.document.body;
	}

	/** returns the window context for the preview */
	get context() {
		return this.ui.output[0].contentWindow;
	}

	/** access to helper scripts for the main window */
	get bridge() {
		return this.context.__CODELAB__;
	}

	/** replaces the page content with new HTML
	 * @param {string} html the content to write
	 */
	writeContent = html => {
		this.onClearMessages();

		// replace the frame entirely to make sure nothing
		// is accidentially loaded twice
		const frame = Component.select('<iframe class="output" />');
		this.ui.output.replaceWith(frame);
		this.ui.output = frame;
		
		// console.log('eh');
		// this.context.location.reload(true);
		const doc = this.context.document;
		doc.open();
		doc.write(html);
		setTimeout(() => {
			doc.close();
		}, 10);
	}

}
