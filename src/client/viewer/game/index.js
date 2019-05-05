window.launchGame = () => {

	// notifies the main window of the size
	const _PhaserGame = Phaser.Game;
	Phaser.Game = function(options) {

		// default options
		options.type = Phaser.AUTO;
		options.mode = Phaser.Scale.FIT;
		options.parent = 'game-view';

		// style the background as needed
		if (window.standAlone) {
			document.body.style.background = options.background || '#000';

			// handle the intro
			const target = document.getElementById('codelab-splash-introduction');

			// hide the splash
			if (options.hideIntro) target.parentNode.removeChild(target);
			else setTimeout(() => target.className += ' hide', 3000);
		}

		// finish the contructor
		_PhaserGame.apply(this, arguments);
		
		// notify the main window of the actual rendering surface
		setTimeout(() => {
			if (!window.top || (window.top && !window.top.__matchViewportSize__)) return;
			const { width, height } = this.renderer;
			window.top.__matchViewportSize__(width, height);
		});

		return this;
	};


	// make sure to keep the prototype
	Phaser.Game.prototype = _PhaserGame.prototype;

	// // capture console messages
	// const _log = console.log;
	// console.log = (...args) => {
	// 	if (window.top && window.top.__logGameMessage__)
	// 		window.top.__logGameMessage__(...args);

	// 	// write normally too
	// 	_log.apply(console, args);
	// };
	
	// console.clear = (...args) => {
	// 	if (window.top && window.top.__clearGameMessages__)
	// 		window.top.__clearGameMessages__(...args);
	// };

	// activate the game for use
	window.activateGame();
};