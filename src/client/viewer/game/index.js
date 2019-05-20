window.launchGame = () => {

	// notifies the main window of the size
	const _PhaserGame = Phaser.Game;
	Phaser.Game = function(options) {

		// default options
		const scaleTarget = options.scale || options;
		scaleTarget.type = Phaser.AUTO;
		scaleTarget.mode = Phaser.Scale.FIT;
		scaleTarget.parent = 'game-view';

		// style the background as needed
		if (window.standAlone) {
			document.body.style.background = options.background || '#000';

			// handle the intro
			const target = document.getElementById('codelab-splash-introduction');

			// hide the splash
			if (options.hideIntro) target.parentNode.removeChild(target);
			else setTimeout(() => target.className += ' hide', 3000);
		}
		else {
			if (console.clear)
				console.clear();
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

	// capture console messages
	const _log = console.log;
	console.log = (...args) => {

		// test for ignored messages
		let ignore = false;
		try { ignore = /https?:\/\/phaser\.io/i.test(args[0]); }
		catch(ex) { }

		// post the message
		if (!ignore && window.top && window.top.__logGameMessage__)
			window.top.__logGameMessage__(...args);

		// write normally too
		_log.apply(console, args);
	};
	
	console.clear = (...args) => {
		if (window.top && window.top.__clearGameMessages__)
			window.top.__clearGameMessages__(...args);
	};

	// activate the game for use
	window.activateGame();
};