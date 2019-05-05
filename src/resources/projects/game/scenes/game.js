import config from '../config';

export default class Game extends Phaser.Scene {
	
	constructor() {
		super('game');
		
		this.score = 0;
	}
	
	// load resources
	preload() {
		this.load.image('coin', '/resources/sprites/coin.png');
		this.load.audio('coin', [ '/resources/sounds/chime.mp3' ]);
	}
	
	
	// create the new view
	create() {
		
		// the coin to click on
		this.coin = this.add.image(0, 0, 'coin')
			.setInteractive()
			.on('pointerup', this.captureCoin, this);
		
		// set the starting position
		this.randomize();
		
		// successful 
		this.successSound = this.sound.add('coin');
		
		// the score display
		this.scoreDisplay = this.add.text(15, 15, '0 points', { font: '22px impact' });
	}
	
	
	// update the coin data
	update() {
		this.coin.scaleX -= 0.01;
		this.coin.scaleY -= 0.01;
		this.coin.rotation += 0.01;
		this.coin.alpha -= 0.01;

		// when the coin is hidden, randomize
		// the position
		if (this.coin.scaleX <= 0) {
			this.randomize();
		}
	}


	// choosing a new random position	
	randomize() {
		this.coin.scaleX = 1;
		this.coin.scaleY = 1;

		this.coin.x = config.width * Math.random();
		this.coin.y = config.height * Math.random();
		this.coin.alpha = 1;
	}
	
	// when clicking a coin, give a point
	captureCoin() {
		
		// successful 
		this.successSound.play();
		
		this.score += 1;
		this.scoreDisplay.text = `${this.score} points`;
		this.randomize();
	}
	
}
