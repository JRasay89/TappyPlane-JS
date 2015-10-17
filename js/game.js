TappyPlane.Game = function(game) {
	this.game = game;
	this.ground_ = null;
	this.myPlane_ = null;
	this.myPlaneColor_ = null;
	this.peaks_ = null;
	this.peaksGenerator_ = null;
	this.environmentType_ = null;

	//UI
	this.gameOver_ = null;
	this.uiBg_ = null;
	this.medal_ = null;
	
	this.playAgainButton_ = null;
	this.playAgainButtonText = null;
	this.quitButton = null;
	this.quitButtonText = null;
	
	//Score 
	this.bestScore_ = null;
	this.bestScoreTitleText_ = null;
	this.bestScoreText = null;
	this.score_ = null;
	this.scoreText_ = null;
	this.finalScoreTitleText_ = null;
	this.finalScoreText_ = null;
	
	//Ready UI
	this.readyGroup_ = null;
	this.isReady_ = null;
	
	//Sound
	this.scoreSound_ = null;
	this.hitSound_ = null;
	this.clickSound_ = null;
	
};

TappyPlane.Game.prototype = {
	create: function() {

		//Activate the arcade physics system
		this.game.physics.startSystem(Phaser.Physics.Arcade);
		//Turn off collision for the bottom of the world
		game.physics.arcade.checkCollision.up = false;

		this.isReady_ = false;
		
		//Add background
		this.game.add.sprite(0, 0, "spriteSheet", "background");
		
		//Get a random type for the environtment
		this.environmentType_ = this.getEnvironmentType();
		//Mountain Peaks
		this.peaks_ = this.game.add.group();		
		//Add ground sprite as a tile and scroll to the left
		this.ground_ = this.game.add.tileSprite(0, TappyPlane.HEIGHT_ - 71, 808, 71, "spriteSheet", "ground"+this.environmentType_);
		this.ground_.autoScroll(-350, 0);
		this.game.physics.arcade.enable(this.ground_);
		this.ground_.body.immovable = true;
		
		//Plane
		//Get random color of the plane
		this.myPlaneColor_ = this.getPlaneColor();
		this.myPlane_ = new TappyPlane.Plane(this.game, 100, 200, this.myPlaneColor_);
		this.myPlane_.alive = false;
		this.myPlane_.body.allowGravity = false;
		this.game.add.existing(this.myPlane_);
		
		//Controls
		var spaceKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		spaceKey.onDown.add(this.myPlane_.jump, this.myPlane_);	
		spaceKey.onDown.addOnce(this.startGame, this);		
		this.game.input.onDown.add(this.myPlane_.jump, this.myPlane_);
		this.game.input.onDown.addOnce(this.startGame, this);
		
		this.readyGroup_ = this.game.add.group();
		this.readyGroup_.add(this.game.add.sprite(TappyPlane.WIDTH_/2, 100, "spriteSheet", "textGetReady"));
		this.readyGroup_.add(this.game.add.sprite(TappyPlane.WIDTH_/2 - 100, 250, "spriteSheet", "tapLeft"));
		this.readyGroup_.add(this.game.add.sprite(TappyPlane.WIDTH_/2 + 100, 250, "spriteSheet", "tapRight"));
		this.readyGroup_.add(this.game.add.sprite(TappyPlane.WIDTH_/2, 275, "spriteSheet", "tapTick"));
		this.readyGroup_.setAll("anchor.x", 0.5);
		this.readyGroup_.setAll("anchor.y", 0.5);

		
		this.bestScore_ = this.getBestScore();
		this.score_ = 0;
		var style_ = { font: "40px Arial", fill: "#FFF", stroke: "#333", strokeThickness: 5, align: "left" };
		this.scoreText_ = this.game.add.text(10, 10, this.score_.toString(), style_);
		this.scoreText_.setShadow(3, 3, '#000000', 5);
		
		this.scoreSound_ = this.game.add.audio("score");
		this.hitSound_ = this.game.add.audio("hit");
		this.clickSound_ = this.game.add.audio("click");

	},
	
	update: function() {
		if (this.myPlane_.alive == false) {
			return;
		}
		//Collision ground
		this.game.physics.arcade.overlap(this.myPlane_, this.ground_, this.crashHandler, null, this);
		//Collision Mountaint peaks
		this.peaks_.forEach(function(peaksGroup) {
			this.updateScore(peaksGroup);
			this.game.physics.arcade.overlap(this.myPlane_, peaksGroup, this.crashHandler, null, this);
		}, this);
		//Check if plane is still in world
		if (!this.myPlane_.inWorld) {
			this.crashHandler();
		}
		
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
	
	/*
	 * Starts the game
	 * Set plane alive and allow gravity value to true
	 * Fade out the ready screen sprites
	 * Start generating mountain peaks
	 */
	startGame: function() {
		if (this.isReady_ == false) {
			this.myPlane_.alive = true;
			this.myPlane_.body.allowGravity = true;
			//Fade out the ready sprites and destroy when it completes
			this.game.add.tween(this.readyGroup_).to({alpha: 0}, 1000, Phaser.Easing.Linear.None, true).onComplete.add(this.destroyReadyScreen, this);
			// add a timer
			this.peaksGenerator_ = this.game.time.events.loop(900, this.addPeaks, this, this.environmentType_);
			this.peaksGenerator_.timer.start();		
			
			this.isReady_ = true;
		}
	},
	/*
	 * Destroy the ready screen when game is started
	 */
	destroyReadyScreen: function() {
		this.readyGroup_.destroy();
	},
	/*
	 * Add peaks 
	 */
	addPeaks: function(environmentType) {
		var peaksGroupY = this.game.rnd.integerInRange(0, -150);
		var peaksGroup = this.peaks_.getFirstExists(false);
		if (!peaksGroup) {
			peaksGroup = new TappyPlane.PeaksGroup(this.game, this.peaks_, environmentType);
		}
		
		peaksGroup.reset(TappyPlane.WIDTH_, peaksGroupY);
		//console.log(this.peaks_.total);
	},
	//Return a random color for the plane
	getPlaneColor: function() {
		var colorNum = Math.floor(Math.random() * 4);
		var color = null;
		switch(colorNum) {
			case 0:
				color = "Blue";
				break;
			case 1:
				color = "Green";
				break;
			case 2:
				color = "Red";
				break;
			case 3:
				color = "Yellow";
				break;
		}
		return color;
		
	},
	//Return a random type for the environment
	getEnvironmentType: function() {
		var typeNum = Math.floor(Math.random() * 5);
		var type = null;
		switch(typeNum) {
			case 0:
				type = "Dirt";
				break;
			case 1:
				type = "Rock";
				break;
			case 2:
				type = "Grass";
				break;
			case 3:
				type = "Snow";
				break;
			case 4:
				type = "Ice";
				break;
		}
		
		return type;
	},
	
	//Stops any movement, control, and show the result screen when a collision occurs
	crashHandler: function() {
		//Do nothing if plane is dead
		if (this.myPlane_.alive == false) {
			return;
		}
		this.hitSound_.play();
		//Set the plane alive value to false
		this.myPlane_.alive = false;
		// Prevent new mountain peaks from appearing
		this.game.time.events.remove(this.peaksGenerator_);
		//Stop all mountain peaks movement
		this.peaks_.forEach(function(peaksGroup){
			peaksGroup.setAll('body.velocity.x', 0);			
		}, this);
		//Stop ground movement
		this.ground_.stopScroll();
		
		
		this.showResult();
		this.saveBestScore();
	},
	//Show the result screen
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
		this.medal_ = this.game.add.sprite(TappyPlane.WIDTH_/2, TappyPlane.HEIGHT_/2 - 65, "spriteSheet", "medal"+this.getMedal());
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
	//Calculate what medal the player receives
	//Gold if score is equal to or greater than the best score
	//Silver if the score percentage is greater than 50%
	//Bronze if the score percentage is less than 50%
	getMedal: function() {
		var percentage = (this.score_ / this.bestScore_) * 100;
		if (percentage <= 50 ) {
			return "Bronze";
		}
		else if (percentage >= 50 && percentage < 100) {
			return "Silver";
		}
		else {
			return "Gold";
		}
		
	},
	
	/*
	 * Updates the score if plane passes a mountain peak
	 */
	updateScore: function(peaksGroup) {
		if ((peaksGroup.exists && !peaksGroup.hasScored_) && (peaksGroup.topPeak_.world.x <= this.myPlane_.world.x)) {
			this.scoreSound_.play();
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
	//Saves current best score in local storage
	saveBestScore: function() {
		//If local storage is supported, save the best score.
		if (typeof(Storage) !== "undefined") {
			localStorage.setItem("bestScore", this.bestScore_.toString());
		}		
	},
	
	//Restart the game
	playAgain: function() {
		this.clickSound_.play();
		this.game.state.start("Game");
	},
	//Quit the game
	quit: function() {
		this.clickSound_.play();
		this.game.state.start("MainMenu");
	}
};

/**********************************
			Plane Class
***********************************/
TappyPlane.Plane = function(game, x, y, frame) {
	this.game = game;
	Phaser.Sprite.call(this, this.game, x, y, "spriteSheet", "plane"+frame+"1");

	this.anchor.set(0.5, 0.5);
	this.animations.add("propeller",["plane"+frame+"1", "plane"+frame+"2", "plane"+frame+"3"], 15, true);
	this.play("propeller");
	
	this.game.physics.arcade.enable(this);
	this.body.collideWorldBounds = true;
	this.body.gravity.y = 1000;
	
	this.jumpSound_ = this.game.add.audio("jump");
		
};

TappyPlane.Plane.prototype = Object.create(Phaser.Sprite.prototype);
TappyPlane.Plane.prototype.constructor = TappyPlane.Plane;

TappyPlane.Plane.prototype.jump = function() {
	//Prevent jump if plane is dead
	if (this.alive == false) {
		return;
	}
	this.jumpSound_.play();
	this.body.velocity.y = -375;
	this.game.add.tween(this).to({angle: 0}, 500).start();	
};

TappyPlane.Plane.prototype.rotatePlane = function() {
	//Stop rotation if plane is dead
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
	this.anchor.x = 0.5;
	this.body.setSize(25, 235, 10);
};
TappyPlane.Peak.prototype = Object.create(Phaser.Sprite.prototype);
TappyPlane.Peak.prototype.constructor = TappyPlane.Peak;


//Mountain Peak Group
TappyPlane.PeaksGroup = function(game, parent, mountainType) {
	Phaser.Group.call(this, game, parent);
	
	if (mountainType == "Dirt" || mountainType == "Rock") {
		this.topPeak_ = new TappyPlane.Peak(this.game, 0, 0, "rockDown");
		this.bottomPeak_ = new TappyPlane.Peak(this.game, 0, 391, "rock");		
	}
	else {
		this.topPeak_ = new TappyPlane.Peak(this.game, 0, 0, "rock"+mountainType+"Down");
		this.bottomPeak_ = new TappyPlane.Peak(this.game, 0, 391, "rock"+mountainType);
	}
	
	
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