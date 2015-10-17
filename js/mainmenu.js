TappyPlane.MainMenu = function(game) {
	this.game = game;
	this.background_ = null;
	this.gameTitleText_ = null;
	this.plane_ = null;
	this.ground_ = null;
	this.playButton_ = null;
	this.playButtonText_ = null;
	this.clickSound_ = null;
};

TappyPlane.MainMenu.prototype = {
	create: function() {
		this.background_ = this.game.add.sprite(0, 0, 'spriteSheet', 'background');
		
		//Set the title
		this.gameTitleText_ = this.game.add.text(TappyPlane.WIDTH_/2, 100, 'Tappy Plane', 
												 { font: "55px Arial", fill: "#FFCC00", stroke: "#333", strokeThickness: 5, align: "left" });
		this.gameTitleText_.anchor.set(0.5, 0.5);
		this.game.add.tween(this.gameTitleText_).to({y:125}, 500, Phaser.Easing.Linear.NONE, true, 0, 1000, true);  

		//Plane
		this.plane_ = this.game.add.sprite(TappyPlane.WIDTH_/2, 250, 'spriteSheet', 'planeBlue1');
		this.plane_.anchor.set(0.5, 0.5);
		this.plane_.animations.add("propeller",["planeBlue1.png", "planeBlue2", "planeBlue3"], 15, true);
		this.plane_.play("propeller");
		
		//Ground
		this.ground_ = this.game.add.tileSprite(0, TappyPlane.HEIGHT_ - 71, 808, 71, "spriteSheet", "groundDirt");
		this.ground_.autoScroll(-200, 0);
		
		//Play Button
		this.playButton_ = this.game.add.button(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 130, "spriteSheet", this.startGame, this, 
											   "buttonLarge", "buttonLarge", "buttonLarge" );
		this.playButton_.anchor.set(0.5, 0.5);
		this.playButtonText_ = this.game.add.text(this.playButton_.x, this.playButton_.y, 'Play', 
												 { font: "35px Arial", fill: "#000000", align: "left" });
		this.playButtonText_.anchor.set(0.5, 0.5);
		
		this.clickSound_ = this.game.add.audio("click");
		
	},
	
	update: function() {
		
	},
	
	startGame: function() {
		this.clickSound_.play();
		this.game.state.start("Game");
	}
};