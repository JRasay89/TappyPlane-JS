TappyPlane.MainMenu = function(game) {
	this.game = game;
	this.background = null;
	this.gameTitleText = null;
	this.plane = null;
	this.ground = null;
	this.playButton = null;
	this.playButtonText = null;
};

TappyPlane.MainMenu.prototype = {
	create: function() {
		this.background = this.game.add.sprite(0, 0, 'spriteSheet', 'background');
		
		//Set the title
		this.gameTitleText = this.game.add.text(TappyPlane.WIDTH_/2, 100, 'Tappy Plane', 
												 { font: "55px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "left" });
		this.gameTitleText.anchor.set(0.5, 0.5);
		this.game.add.tween(this.gameTitleText).to({y:125}, 500, Phaser.Easing.Linear.NONE, true, 0, 1000, true);  

		//Plane
		this.plane = this.game.add.sprite(TappyPlane.WIDTH_/2, 250, 'spriteSheet', 'planeBlue1');
		this.plane.anchor.set(0.5, 0.5);
		this.plane.animations.add("propeller",["planeBlue1.png", "planeBlue2", "planeBlue3"], 15, true);
		this.plane.play("propeller");
		
		//Ground
		this.ground = this.game.add.tileSprite(0, TappyPlane.HEIGHT_ - 71, 808, 71, "spriteSheet", "groundDirt");
		this.ground.autoScroll(-200, 0);
		
		//Play Button
		this.playButton = this.game.add.button(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 130, "spriteSheet", this.startGame, this, 
											   "buttonLarge", "buttonLarge", "buttonLarge" );
		this.playButton.anchor.set(0.5, 0.5);
		this.playButtonText = this.game.add.text(this.playButton.x, this.playButton.y, 'Play', 
												 { font: "35px Arial", fill: "#000000", align: "left" });
		this.playButtonText.anchor.set(0.5, 0.5);
		
	},
	
	update: function() {
		
	},
	
	startGame: function() {
		this.game.state.start("Game");
	}
};