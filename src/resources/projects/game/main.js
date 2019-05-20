new Phaser.Game({
	
	// game viewport size
	scale: {
		width: 500,
		height: 800
	},
	

	scene: {

		// this loads images/sounds for the game
		preload() {
			this.load.image('ball', '/resources/ball.png');
			this.load.audio('bounce', '/resources/bounce.mp3');
		},
		
		
		// this happens when the game is created
		create() {
			this.bounce = this.sound.add('bounce');
			
			// create the bouncing ball
			this.ball = this.add.image(0, 0, 'ball');
			
			// set how fast the ball moves
			this.moveX = 3;
			this.moveY = 3;
		},
		
		
		// this happens each frame of animation
		update() {
			
			// move the ball on the screen on
			// the x and y axis
			this.ball.x += this.moveX;
			this.ball.y += this.moveY;
			
			// rotate the ball a little bit
			this.ball.rotation += this.moveX * 0.025;
			
			// get the size of the view
			const { width, height } = this.game.renderer;
			
			// track if the ball changes directions
			let didChangeDirection;
			
			// if out of the view, switch the direction
			if (this.ball.x > width || this.ball.x < 0) {
				this.moveX *= -1;
				didChangeDirection = true;
			}
			
			// if out of the view, switch the direction
			if (this.ball.y > height || this.ball.y < 0) {
				this.moveY *= -1;
				didChangeDirection = true;
			}
			
			// when the direction changes, we want to play
			// a sound as if it hit the wall
			if (didChangeDirection) {
				this.bounce.play();
			}
			
		}
		
	}
	
});