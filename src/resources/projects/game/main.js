
// configuration
import config from './config';

// scenes for the game
import intro from './scenes/intro';
import game from './scenes/game';

// starting the game
new Phaser.Game({
	background: '#2A82B7',
	
	// default sizing
	scale: {
		mode: Phaser.Scale.FIT,
		width: config.width,
		height: config.height,
	},
	
	// each game scene
	scene: [
		intro,
		game
	]
	
});