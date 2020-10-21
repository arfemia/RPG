

var controller = require('../view/gameView');

var TILE_WIDTH = settings.tileSize.width;
var TILE_HEIGHT = settings.tileSize.height;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄


function Door(params) {
    params = params || {};

    this.x = params.x || 0;
    this.y = params.y || 0;
    this.w = params.w || TILE_WIDTH;
    this.h = params.h || TILE_HEIGHT;
    

    this.sprites = params.sprites;
    this.frame = 0;
    this.animated = this.sprites.length > 1;

    this.otherSide = params.otherSide || {map : 'test', doorID : 1};
    this.isLocked = params.isLocked || false;


}

module.exports = Door;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

//exports._use();
