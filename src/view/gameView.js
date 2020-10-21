var Texture       = require('pixelbox/Texture');
var viewManager   = require('../viewManager');
var Player        = require('../Player');
var level         = require('../level');
var TextBox       = require('../TextBox');

var SCREEN_W = settings.screen.width;
var SCREEN_H = settings.screen.height;
var TILE_W   = settings.tileSize.width;
var TILE_H   = settings.tileSize.height;
var CENTER_X = ~~(SCREEN_W / 2) - 4;
var CENTER_Y = ~~(SCREEN_H / 2) - 4;

var CAMERA_ACCELERATION       = 0.1;
var CAMERA_SHAKE_ACCELERATION = 0.35;
var CAMERA_SHAKE_FRICTION     = 0.85;


var player = exports.player = new Player();

// camera
var backgroundColor = 0;
var parallax       = 1;
var camX           = 0;
var camY           = 0;
var camShakeX      = 0;
var camShakeY      = 0;
var camShakeSpeedX = 0;
var camShakeSpeedY = 0;

// level
var CURRENT_LEVEL = "";
var MAX_LEVEL_W   = 0;
var MAX_LEVEL_H   = 0;
var needKey = false;

// entities
var entitiesDraw    = [];
var entitiesCollide = [];

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function resetCamera() {
	camShakeX      = 0;
	camShakeY      = 0;
	camShakeSpeedX = 0;
	camShakeSpeedY = 0;
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.getLevel = function () {
	return assets.levels[CURRENT_LEVEL];
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function loadLevel(params) {
	params = params || false;

	if (params.player) player = params.player;

    resetCamera();

	// reset level
	entitiesDraw    = [];
    entitiesCollide = [];

    // get data
	var levelData = assets.levels[CURRENT_LEVEL];
   // console.log(player.x, player.y);
    // load level
	level.load(CURRENT_LEVEL);
	backgroundColor = levelData.paper;
	parallax        = levelData.parallax;

	
	

	var entryPoint = (params.door) ? {x: params.door.x, y: params.door.y} : 
								{x : levelData.spawn.x, y : levelData.spawn.y};


    // level boundaries
	MAX_LEVEL_W = level.width  * TILE_W - SCREEN_W;
	MAX_LEVEL_H = level.height * TILE_H - SCREEN_H;

    
	// set player position
	//player.x = entryPoint.entry.x * TILE_W;
    //player.y = entryPoint.entry.y * TILE_H;
    player.x = entryPoint.x * TILE_W + 2;
	player.y = entryPoint.y * TILE_H;
	player.lastDir = (params.door) ? params.door.lastDir : "down";


	// init camera on player
	camX = clamp(player.x - CENTER_X, 0, MAX_LEVEL_W);
	camY = clamp(player.y - CENTER_Y, 0, MAX_LEVEL_H);
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.open = function(params) {
	params = params || {};
	if (params.resume) return;
	if (params.levelId    !== undefined) CURRENT_LEVEL = params.levelId;
	loadLevel(params);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.goThroughDoor = function (params) {
	
	var door = assets.levels[CURRENT_LEVEL].doors[params.geometry.door - 1];
	//console.log(player.x, player.y);
	// TODO animation
	//player = p;
	//player.reset();
	
	CURRENT_LEVEL = door.otherSide.map;
	viewManager.open('intermission', 
	{door : door.otherSide, player : this.player, camera : {x : camX, y: camY}});
	//loadLevel({door : door.otherSide});
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.openInventory = function() {
	viewManager.open("inventory", {player : this.player, camera : {x : camX, y: camY}, resume : true});
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = function () {

    paper(backgroundColor).cls();
    player.update();

    // update camera position
	var scrollX = clamp(player.x - CENTER_X, 0, MAX_LEVEL_W);
	var scrollY = clamp(player.y - CENTER_Y, 0, MAX_LEVEL_H);

   
	camX += (scrollX - camX) * CAMERA_ACCELERATION;
    camY += (scrollY - camY) * CAMERA_ACCELERATION;
    
    // camera shaking
	/* 
	camShakeSpeedX -= camShakeX * CAMERA_SHAKE_ACCELERATION;
	camShakeSpeedY -= camShakeY * CAMERA_SHAKE_ACCELERATION;
	camShakeSpeedX *= CAMERA_SHAKE_FRICTION;
	camShakeSpeedY *= CAMERA_SHAKE_FRICTION;
	camShakeX += camShakeSpeedX;
    camShakeY += camShakeSpeedY;
    **/
    var cx = camX + camShakeX;
	var cy = camY + camShakeY;
	// background with parallax effect
	camera(cx * parallax, cy * parallax);
	level.drawBackground();

    // main level
	camera(cx, cy);
	level.draw();
	player.draw();
}
