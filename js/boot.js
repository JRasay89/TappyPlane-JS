var TappyPlane = {
	WIDTH_ : 800,
	HEIGHT_: 480
};

TappyPlane.Boot = function(game){
	this.game = game;
};

TappyPlane.Boot.prototype = {
	preload: function() {
		
	},
	
	create: function() {
        this.game.state.start('Preloader');
	}
	
};