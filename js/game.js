TappyPlane.Game = function(game) {
	this.game = game;
	this.ground_ = null;
	this.myPlane_ = null;
	this.peaks_ = null;
};

TappyPlane.Game.prototype = {
	create: function() {
		//Activate the arcade physics system
		this.game.physics.startSystem(Phaser.Physics.Arcade);
		//Turn off collision for the bottom of the world
		game.physics.arcade.checkCollision.up = false;
		
		this.game.add.sprite(0, 0, "spriteSheet", "background");
		
		//Mountain Peaks 
		this.peaks_ = this.game.add.group();
		//var bottomPeak = this.game.add.sprite(0, 451, "spriteSheet", "rock");
		//var topPeak = this.game.add.sprite(0, 0, "spriteSheet", "rockDown");
		//this.peaks_.add(bottomPeak);
		//this.peaks_.add(topPeak);
		//this.peaks_.x = 250;
		//this.peaks_.y = -210;	
		//console.log(this.peaks_.total);
		//var peaksGroup = this.peaks_.getFirstExists(false);
		//peaksGroup = new TappyPlane.PeaksGroup(this.game, this.peaks_, "rock");
		//console.log(this.peaks_.total);
		
		//Add ground sprite as a tile and scroll to the left
		this.ground_ = this.game.add.tileSprite(0, TappyPlane.HEIGHT_ - 71, 808, 71, "spriteSheet", "groundDirt");
		this.ground_.autoScroll(-350, 0);
		this.game.physics.arcade.enable(this.ground_);
		this.ground_.body.immovable = true;
		
		//Plane
		this.myPlane_ = new TappyPlane.Plane(this.game, 100, 200, "planeBlue");
		this.game.add.existing(this.myPlane_);

		
		// add a timer
		this.peaksGenerator = this.game.time.events.loop(900, this.addPeaks, this);
		this.peaksGenerator.timer.start();
	},
	
	update: function() {
		//this.game.physics.arcade.collide(this.myPlane_.plane_, this.ground_);
		this.myPlane_.rotatePlane();
	},
	
	render: function() {
		//this.game.debug.body(this.ground_);
	},
	
	addPeaks: function() {
		var pipeGroupY = this.game.rnd.integerInRange(0, -150);
		var peaksGroup = this.peaks_.getFirstExists(false);
		if (!peaksGroup) {
			peaksGroup = new TappyPlane.PeaksGroup(this.game, this.peaks_, "rock");
		}
		
		peaksGroup.reset(TappyPlane.WIDTH_, pipeGroupY);
		//console.log(this.peaks_.total);
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
	this.body.velocity.y = -375;
	this.game.add.tween(this).to({angle: 0}, 500).start();	
};

TappyPlane.Plane.prototype.rotatePlane = function() {
	if (this.angle < 90) {
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
};
TappyPlane.Peak.prototype = Object.create(Phaser.Sprite.prototype);
TappyPlane.Peak.prototype.constructor = TappyPlane.Peak;


//Mountain Peak Group
TappyPlane.PeaksGroup = function(game, parent, mountainType) {
	Phaser.Group.call(this, game, parent);
	
	this.topPeak_ = new TappyPlane.Peak(this.game, 0, 0, mountainType+"Down");
	this.bottomPeak_ = new TappyPlane.Peak(this.game, 0, 391, mountainType);
	
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
		this.exist = false;
		//console.log("Kill");
	}
};

TappyPlane.PeaksGroup.prototype.reset = function(x, y) {
	this.topPeak_.reset(0, 0);
	this.bottomPeak_.reset(0, 391);
	this.x = x;
	this.y = y;
	this.setAll('body.velocity.x', -350);
	this.exists = true;
};