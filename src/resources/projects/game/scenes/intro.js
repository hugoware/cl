import config from '../config';

export default class extends Phaser.Scene {
	
	constructor() {
		super('intro');
	}
	
	preload() {
		this.load.image('play-btn', '/resources/sprites/play-btn.png');
	}
	
	create() {
		const width = config.width / 2;
		const height = config.height / 2;

		this.add.image(width, height, 'play-btn')
			.setInteractive()
			.on('pointerup', this.startGame, this);
	}
	
	startGame() {
		this.scene.stop('intro');
		this.scene.start('game');
	}
	
}