var TileMap = require('pixelbox/TileMap');
var Texture = require('pixelbox/Texture');
var tiles = require('./tiles');



var TILE_WIDTH  = settings.tileSize.width;
var TILE_HEIGHT = settings.tileSize.height;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var t = exports;

t.width = 20;
t.height = 18;

t.background = null;
t.layers = null;
t.doors = null;
t.geometry = new TileMap(t.width, t.height);

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

exports.load = function (levelId) {
    var path = levelId + '/'; 

    t.geometry = getMap(path + 'G');
    if (!t.geometry) console.error('Could not find map',  path + 'G');

    // resize
    t.width = t.geometry.width;
	t.height = t.geometry.height;
	
    var w = t.width  * TILE_WIDTH;
	var h = t.height * TILE_HEIGHT;

	// background
	t.background = getMap(path + 'B');
	
    
    // design
    t.layers = [];
	t.doors = [];
	
	var d = 0;
	var door = assets.levels[levelId].doors[d];
	while (door) {
		t.doors.push(door);
		door = assets.levels[levelId].doors[++d];
	}

    var l = 0;
	var layer = getMap(path + 'L' + l);
	while (layer) {
		// t.layer.draw(layer);
		t.layers.push(layer);
		layer = getMap(path + 'L' + (++l));
	}

    return t;
    
}
    
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.drawBackground = function() {
	if (t.background) draw(t.background, 0, 0);
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.draw = function() {

    

    for (var i = 0; i < t.layers.length; i++) {
        draw(t.layers[i], 0, 0);

    }

    
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.getTileAt = function (x, y) {
	x = ~~(x / TILE_WIDTH);
	y = ~~(y / TILE_HEIGHT);
	// clamp position in level bondaries
	if (x < 0) x = 0; else if (x >= t.width)  x = t.width  - 1;
	if (y < 0) y = 0; else if (y >= t.height) y = t.height - 1;

	var tilegeometry = tiles.getTileFromMapItem(t.geometry.get(x, y));
	// if (x < 0 || y < 0 || x >= t.width || y >= t.height) return EMPTY;
	return {geometry : tilegeometry, door : t.doors[tilegeometry.door - 1]};
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.getTile = function (i, j) {
	// clamp position in level bondaries
	if (i < 0) i = 0; else if (i >= t.width)  i = t.width  - 1;
	if (j < 0) j = 0; else if (j >= t.height) j = t.height - 1;
	return tiles.getTileFromMapItem(t.geometry.get(i, j));
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

exports.getEntryPoints = function () {
	
};