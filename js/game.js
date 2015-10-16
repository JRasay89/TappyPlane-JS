TappyPlane.Game = function(game) {
	this.game = game;
	this.ground_ = null;
	this.myPlane_ = null;
	this.peaks_ = null;
	this.peaksGenerator_;
	
	//Score UI
	this.gameOver_ = null;
	this.uiBg_ = null;
	this.playAgainButton_ = null;
	this.playAgainButtonText = null;
	this.quitButton = null;
	this.quitButtonText = null;
	
	this.bestScore_ = null;
	this.bestScoreTitleText_ = null;
	this.bestScoreText = null;
	this.score_ = null;
	this.scoreText_ = null;
	this.finalScoreTitleText_ = null;
	this.finalScoreText_ = null;
	
	this.medal_ = null;
	
};

TappyPlane.Game.prototype = {
	create: function() {

		//Activate the arcade physics system
		this.game.physics.startSystem(Phaser.Physics.Arcade);
		//Turn off collision for the bottom of the world
		game.physics.arcade.checkCollision.up = false;
		

		
		//Add background
		this.game.add.sprite(0, 0, "spriteSheet", "background");
		
		//Mountain Peaks 
		this.peaks_ = this.game.add.group();
		
		//Add ground sprite as a tile and scroll to the left
		this.ground_ = this.game.add.tileSprite(0, TappyPlane.HEIGHT_ - 71, 808, 71, "spriteSheet", "groundDirt");
		this.ground_.autoScroll(-350, 0);
		this.game.physics.arcade.enable(this.ground_);
		this.ground_.body.immovable = true;
		
		//Plane
		this.myPlane_ = new TappyPlane.Plane(this.game, 100, 200, "planeBlue");
		this.game.add.existing(this.myPlane_);

		
		// add a timer
		this.peaksGenerator_ = this.game.time.events.loop(900, this.addPeaks, this);
		this.peaksGenerator_.timer.start();
		
		this.bestScore_ = this.getBestScore();
		this.score_ = 0;
		var style_ = { font: "40px Arial", fill: "#FFF", stroke: "#333", strokeThickness: 5, align: "left" };
		this.scoreText_ = this.game.add.text(10, 10, this.score_.toString(), style_);
		this.scoreText_.setShadow(3, 3, '#000000', 5);

	},
	
	update: function() {
		if (this.myPlane_.alive == false)
			return;
		//Collision ground
		this.game.physics.arcade.overlap(this.myPlane_, this.ground_, this.crashHandler, null, this);
		//Collision Mountaint peaks
		this.peaks_.forEach(function(peaksGroup) {
			//console.log(peaksGroup.name);
			//console.log(peaksGroup.hasScored_);
			this.updateScore(peaksGroup);
			this.game.physics.arcade.overlap(this.myPlane_, peaksGroup, this.crashHandler, null, this);
		}, this);
		this.myPlane_.rotatePlane();
	},
	
	render: function() {
		//this.game.debug.body(this.ground_);
		/*
		this.peaks_.forEachAlive(function(peaksGroup) {
			this.game.debug.body(peaksGroup.topPeak_);
		}, this);
		*/
	},
	
	addPeaks: function() {
		var peaksGroupY = this.game.rnd.integerInRange(0, -150);
		var peaksGroup = this.peaks_.getFirstExists(false);
		if (!peaksGroup) {
			peaksGroup = new TappyPlane.PeaksGroup(this.game, this.peaks_, "rock");
			peaksGroup.name = "group"+ peaksGroupY;
		}
		
		peaksGroup.reset(TappyPlane.WIDTH_, peaksGroupY);
		//console.log(this.peaks_.total);
	},
	
	crashHandler: function() {
		//this.showResult();
		//console.log("Collision Occured");
		if (this.myPlane_.alive == false) {
			return;
		};
		
		this.myPlane_.alive = false;
		// Prevent new mountain peaks from appearing
		this.game.time.events.remove(this.peaksGenerator_);
		//Stop all mountain peaks movement
		this.peaks_.forEach(function(peaksGroup){
			peaksGroup.setAll('body.velocity.x', 0);			
		}, this);
		//Stop ground movement
		this.ground_.autoScroll(0, 0);
		
		
		this.showResult();
		this.saveBestScore();
	},
	
	showResult: function() {
		//Text Style
		var buttonStyle = { font: "25px Arial", fill: "#FFF", stroke: "#333", strokeThickness: 5, align: "left" };
		var scoreStyle = { font: "20px Arial", fill: "#FFF", stroke: "#333", strokeThickness: 5, align: "left" };
		
		//Game Over Text Sprite
		this.gameOver_ = this.game.add.sprite(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 - 175, "spriteSheet", "textGameOver");
		this.gameOver_.anchor.set(0.5, 0.5);
		//UI background sprite
		this.uiBg_ = this.game.add.sprite(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2, "spriteSheet", "UIbg");
		this.uiBg_.anchor.set(0.5, 0.5);
		//Medal sprite
		this.medal_ = this.game.add.sprite(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 - 65, "spriteSheet", "medalBronze");
		this.medal_.anchor.set(0.5, 0.5);
		
		this.finalScoreTitleText_ = this.game.add.text(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 25, 'Score', scoreStyle );
		this.finalScoreTitleText_.anchor.set(0.5, 0.5);
		this.finalScoreText_ = this.game.add.text(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 50, this.score_.toString(), scoreStyle );
		this.finalScoreText_.anchor.set(0.5, 0.5);
		
		this.bestScoreTitleText_ = this.game.add.text(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 85, 'Best', scoreStyle );
		this.bestScoreTitleText_.anchor.set(0.5, 0.5);
		this.bestScoreText_ = this.game.add.text(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 + 110, this.bestScore_.toString(), scoreStyle );
		this.bestScoreText_.anchor.set(0.5, 0.5);
		
		//Buttons
		//Quit Button
		this.quitButton_ = this.game.add.button(TappyPlane.WIDTH_/2 + 68, TappyPlane.HEIGHT_/2 + 175, "spriteSheet", 
													this.quit, this, "buttonSmall", "buttonSmall", "buttonSmall");
		this.quitButton_.anchor.set(0.5, 0.5);
		this.quitButtonText_ = this.game.add.text(this.quitButton_.x, this.quitButton_.y, 'Quit', buttonStyle );											 
		this.quitButtonText_.anchor.set(0.5, 0.5);
		
		//Play Again Button
		this.playAgainButton_ = this.game.add.button(TappyPlane.WIDTH_/2 - 68, TappyPlane.HEIGHT_/2 + 175, "spriteSheet", 
														this.playAgain, this, "buttonSmall", "buttonSmall", "buttonSmall");
		this.playAgainButton_.anchor.set(0.5, 0.5);
		this.playAgainButtonText_ = this.game.add.text(this.playAgainButton_.x, this.playAgainButton_.y, 'Play', buttonStyle);
		this.playAgainButtonText_.anchor.set(0.5, 0.5);		
	},
	
	updateScore: function(peaksGroup) {
		if ((peaksGroup.exists && !peaksGroup.hasScored_) && (peaksGroup.topPeak_.world.x <= this.myPlane_.world.x)) {
			peaksGroup.hasScored_ = true;
			this.score_++;
			this.scoreText_.setText(this.score_.toString());
			
			if (this.score_ > this.bestScore_) {
				this.bestScore_ = this.score_;
			}
		}
	},
	
	getBestScore: function() {
		//Check if local storage is supported
		if (typeof(Storage) !== "undefined") {
			//If no high score is saved set to 0, else get the best score
			if (localStorage.getItem("bestScore") === null) {
				return 0;
			}
			else {
				return parseInt(localStorage.getItem("bestScore"));
			}
		}
		//Else set the high score to 0
		else {
			return 0;
		}		
	},
	
	saveBestScore: function() {
		//If local storage is supported, save the best score.
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("bestScore", this.bestScore_.toString());
		}		
	},
	
	playAgain: function() {
		this.game.state.start("Game");
	},
	
	quit: function() {
		this.game.state.start("MainMenu");
	}
};

/**********************************
			Plane Class
***********************************/
TappyPlane.Plane = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, "spriteSheet", frame+"1");

	this.anchor.set(0.5, 0.5);
	this.animations.add("propeller",[frame+"1", frame+"2", frame+"3"], 15, true);
	this.play("propeller");
	
	this.game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 1000;
	
	var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	spaceKey.onDown.add(this.jump, this);		
	this.game.input.onDown.add(this.jump, this);

	
};

TappyPlane.Plane.prototype = Object.create(Phaser.Sprite.prototype);
TappyPlane.Plane.prototype.constructor = TappyPlane.Plane;

TappyPlane.Plane.prototype.jump = function() {
	if (this.alive == false) {
		return;
	};
	this.body.velocity.y = -375;
	this.game.add.tween(this).to({angle: 0}, 500).start();	
};

TappyPlane.Plane.prototype.rotatePlane = function() {
	if (this.angle < 90 && this.alive == true) {
		this.angle += 1;
	}	
};

/******************************************
				Mountain Peaks
*******************************************/
TappyPlane.Peak = function(game, x, y, frame) {
	Phaser.Sprite.call(this, game, x, y, "spriteSheet", frame);
	
	this.game.physics.arcade.enableBody(this);
	this.body.immovable = true;
	this.body.setSize(20, 235, 55);
};
TappyPlane.Peak.prototype = Object.create(Phaser.Sprite.prototype);
TappyPlane.Peak.prototype.constructor = TappyPlane.Peak;


//Mountain Peak Group
TappyPlane.PeaksGroup = function(game, parent, mountainType) {
	Phaser.Group.call(this, game, parent);
	
	this.topPeak_ = new TappyPlane.Peak(this.game, 0, 0, mountainType+"Down");
	this.bottomPeak_ = new TappyPlane.Peak(this.game, 0, 391, mountainType);
	this.hasScored_ = false;
	
	this.add(this.topPeak_);
	this.add(this.bottomPeak_);
	
	this.setAll("body.velocity.x", -350);
	
	
	
};

TappyPlane.PeaksGroup.prototype = Object.create(Phaser.Group.prototype);
TappyPlane.PeaksGroup.prototype.constructor = TappyPlane.PeaksGroup;

TappyPlane.PeaksGroup.prototype.update = function() {
	this.checkWorldBounds();
};

TappyPlane.PeaksGroup.prototype.checkWorldBounds = function() {
	if (!this.topPeak_.inWorld) {
		this.exists = false;
	}
};

TappyPlane.PeaksGroup.prototype.reset = function(x, y) {
	this.topPeak_.reset(0, 0);
	this.bottomPeak_.reset(0, 391);
	this.x = x;
	this.y = y;
	this.setAll('body.velocity.x', -350);
	this.hasScored_ = false;
	this.exists = true;
};