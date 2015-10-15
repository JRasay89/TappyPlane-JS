TappyPlane.PreLoader = function(game) {
	
};

TappyPlane.PreLoader.prototype = {
	preload: function() {
		this.game.load.atlas('spriteSheet', 'assets/spritesheets/spriteSheet.png', 'assets/spritesheets/spriteSheet.json');		

	},
	
	create: function() {
		this.game.state.start("MainMenu");
	}
};