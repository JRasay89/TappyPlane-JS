TappyPlane.PreLoader = function(game) {
	this.game = game;
};

TappyPlane.PreLoader.prototype = {
	preload: function() {
		this.game.load.atlas('spriteSheet', 'assets/spritesheets/spriteSheet.png', 'assets/spritesheets/spriteSheet.json');	
		// Load the jump sound
        this.game.load.audio('jump', 'assets/sounds/jump.wav');
		// Load the score sound
        this.game.load.audio('score', 'assets/sounds/score.wav');
		// Load the hit sound
        this.game.load.audio('hit', 'assets/sounds/hit.wav'); 		
		// Load the click sound
        this.game.load.audio('click', 'assets/sounds/click.wav'); 		

	},
	
	create: function() {
		this.game.state.start("MainMenu");
	}
};