  
var viewManager = require('./viewManager');
var gameView    = require('./view/gameView');
var level       = require('./level');
var AABB        = require('./AABBcollision');
var tiles       = require('./tiles');
var Inventory = require('./Inventory');


var ASSET = assets.entity.player;

var TILE_WIDTH  = settings.tileSize.width;
var TILE_HEIGHT = settings.tileSize.height;

var ANIMATION_SPEED = 0.08;
var ANIMATION_SPEED_RUN = 0.15;
var SPEED_WALK  = 0.6;
var SPEED_RUN   = 1;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Player() {
    this.x = 0;
    this.y = 0;
    this.w = TILE_WIDTH;
    this.h = TILE_HEIGHT;
    this.lastDir = 'down';
    this.idle = true;
    this.frozen = false;
    this.speed = SPEED_WALK;
    this.animSpeed = ANIMATION_SPEED;
    this.inventory = new Inventory();
    this.reset();

}

module.exports = Player;
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.reset = function() {
    this.sx = 0;
	this.sy = 0;
	this.dx = 0;
	this.dy = 0;


	// state
    this.onTile = tiles.EMPTY;
    
    // rendering
	this.frame = 0;
	this.flipH = false;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.draw = function() {
    // idle
    var img = ASSET.down1;
    switch (this.lastDir) {
        case "up":
            img = ASSET['up1'];
            break;
        case "down":
            img = ASSET['down1'];
            break;
        case "horiz":
            img = ASSET['horz1'];
            break;
    }
    
    if (this.idle) {
        switch (this.lastDir) {
            case "up":
                img = ASSET['up1'];
                break;
            case "down":
                img = ASSET['down1'];
                break;
            case "horiz":
                img = ASSET['horz1'];
                break;
        }
    }
    //running
	else if (this.sx > 0.5 || this.sx < -0.5) {
		this.frame += this.animSpeed;
		if (this.frame >= 4) this.frame = 0;
		img = ASSET['horz' + ~~this.frame];
    }
    else if (this.sy > 0.5) {
        this.frame += this.animSpeed;
        if (this.frame >= 4) this.frame = 0;
        img = ASSET['down' + ~~this.frame];
    }
    else if (this.sy < -0.5) {
        this.frame += this.animSpeed;
        if (this.frame >= 4) this.frame = 0;
        img = ASSET['up' + ~~this.frame];
    }
    
    draw(img, this.x - 1, this.y - 1, this.flipH);
    
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.update = function() {
    this._upadateControls();

    this.levelCollisions();
}

Player.prototype.OneInputMovementUpdate = function() {
    
    

    if (gamepad.btn.left) {
        this.sx = -this.speed;
        this.sy = 0;
        this.lastDir = "horiz";
        this.flipH = true;
        this.idle = false;
        return;
    }

    else if (gamepad.btn.right) {
        this.sx = this.speed;
        this.sy = 0;
        this.lastDir = "horiz";
        this.idle = false;
        this.flipH = false;
        return;
    }
    else if (gamepad.btn.up) {
        this.sx = 0;
        this.sy = -this.speed;
        this.lastDir = "up";
        this.idle = false;
        return;
    }
    else if (gamepad.btn.down) {
        this.sx = 0;
        this.sy = this.speed;
        this.lastDir = "down";
        this.idle = false;
        return;
    }
}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype._upadateControls = function() {
    //if (this.frozen) return;

    if (gamepad.btnr.start) {
        gameView.openInventory();
        
    }

    if (gamepad.btn.lt) {
        this.speed = SPEED_RUN;
        this.animSpeed = ANIMATION_SPEED_RUN;
    } else {
        this.speed = SPEED_WALK;
        this.animSpeed = ANIMATION_SPEED;
    }

   
    // no new input
    if ((!gamepad.btn.left && !gamepad.btn.right && !gamepad.btn.up && !gamepad.btn.down)) {
        this.idle = true;
        this.sx = 0;
        this.sy = 0;
        
    }

    // idle -> movement
    
    else if (this.idle) {
        this.OneInputMovementUpdate();
        
    }
    // already moving
    // change dir 
    else if ((gamepad.btn.left || gamepad.btn.right) && (gamepad.btnp.up || gamepad.btnp.down)) { //horiz to vertical
        this.sx = 0;
        this.sy = (gamepad.btnp.up) ? -this.speed : this.speed;
        this.lastDir = (gamepad.btnp.up) ? "up" : "down";
        this.idle = false;
    }
    else if ((gamepad.btn.down || gamepad.btn.up) && (gamepad.btnp.left || gamepad.btnp.right)) { //vertical to horiz
        this.sy = 0;
        this.sx = (gamepad.btnp.left) ? -this.speed : this.speed;
        this.lastDir = "horz";
        this.flipH = gamepad.btnp.left;
        this.idle = false;
    }
    // two movement inputs
    else if ((gamepad.btn.left || gamepad.btn.right) && (gamepad.btn.up || gamepad.btn.down)) {
        this.idle = false;
        // continue in same direction if no new input and holding two buttons : <^ ^> <v or v>
        switch (this.lastDir) {
            case "up":
                this.sy = (gamepad.btn.up) ? -this.speed : 0;
                this.sx = (gamepad.btn.up) ? 0 : ((gamepad.btn.left) ? -this.speed : this.speed);
                this.lastDir = (gamepad.btn.up) ? "up" : "horz";
                this.flipH = (gamepad.btn.up) ? this.flipH : ((gamepad.btn.left) ? true : false);
                break;
            case "down":
                this.sy = (gamepad.btn.down) ? this.speed : 0;
                this.sx = (gamepad.btn.down) ? 0 : ((gamepad.btn.left) ? -this.speed : this.speed);
                this.lastDir = (gamepad.btn.down) ? "down" : "horz";
                this.flipH = (gamepad.btn.down) ? this.flipH : ((gamepad.btn.left) ? true : false);
                break;
            case "horz":
                if (this.flipH) {
                    this.sx = (gamepad.btn.left) ? -this.speed : 0
                    this.sy = (gamepad.btn.left) ? 0 : ((gamepad.btn.up) ? -this.speed : this.speed);
                    this.lastDir = (gamepad.btn.left) ? "horz" : ((gamepad.btn.up) ? "up" : "down");
                    this.flipH = gamepad.btn.left;
                    break;
                } else {
                    this.sx = (gamepad.btn.right) ? this.speed : 0
                    this.sy = (gamepad.btn.right) ? 0 : ((gamepad.btn.up) ? -this.speed : this.speed);
                    this.lastDir = (gamepad.btn.right) ? "horz" : ((gamepad.btn.up) ? "up" : "down");
                    this.flipH = !gamepad.btn.right;
                    break;
                }
        }
    }

    

    // only 1 movement input
    this.OneInputMovementUpdate();

    var tile = this.onTile = level.getTileAt(this.x + 4, this.y + 4).geometry;

    if (this.idle && gamepad.btnr.A) this.useInteractive();
    

}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.levelCollisions = function () {
    // round speed
	this.sx = ~~(this.sx * 100) / 100;
	this.sy = ~~(this.sy * 100) / 100;

	var nx = this.x + this.sx; // TODO dt
	var ny = this.y + this.sy; // TODO dt

	// check level boundaries
	var maxX = level.width  * TILE_WIDTH - (this.w); // TODO don't need to be calculated each frames
    var maxY = level.height * TILE_HEIGHT - (this.h); // give monkey 8 more tiles for chnce to teleport
    
	if (nx < 0)    nx = 0;
    if (nx > maxX) nx = maxX;
    if (ny < 0)    ny = 0;
    if (ny > maxY) ny = maxY;

    var front = this.w;
    var frontOffset = 0;
    var indent = -5;
    if (this.sx < 0) {front = 0; frontOffset = this.w; indent = 3;};

    if (this.sx !== 0) {
        if (level.getTileAt(nx + front + indent, this.y + (this.h / 2)).geometry.isSolid 
            || level.getTileAt(nx + front + indent, this.y + this.h - 2).geometry.isSolid) {
                this.sx = 0;

			    nx = ~~(nx / TILE_WIDTH) * TILE_WIDTH + frontOffset - indent;
		}
    } else {
		// if no horizontal speed, round position to avoid flickering
		nx = Math.round(nx);
    }
    var vertFront = this.h
    var vertFrontOffset = 0;
    indent = -1;
    if (this.sy < 0) {vertFront = 0; vertFrontOffset = this.h; indent = 7;}
    if (this.sy !== 0) {
        if (level.getTileAt(this.x + 3, ny + vertFront + indent).geometry.isSolid 
            || level.getTileAt(this.x + this.w - 7, ny + vertFront + indent).geometry.isSolid) {
                this.sy = 0;
			    ny = ~~(ny / TILE_HEIGHT) * TILE_HEIGHT + vertFrontOffset - indent;
		}
    } else {
		// if no vertical speed, round position to avoid flickering
		ny = Math.round(ny);
    }
    
    
    this.x = nx;
    this.y = ny;


}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.useInteractive = function () {
    
	if (this.onTile.door) {
  
        gameView.goThroughDoor(level.getTileAt(this.x + 4, this.y + 4));
    }
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.setInventory = function(inventory) {
    if (!inventory) return;
    this.inventory = inventory;
};
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Player.prototype.getInventory = function() {
    return this.inventory;
};
