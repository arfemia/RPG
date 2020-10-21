var Texture = require('pixelbox/Texture');
var Inventory = require('../Inventory');

var TILE_WIDTH  = settings.tileSize.width;
var TILE_HEIGHT = settings.tileSize.height;
var ANIM_SPEED = 0.2;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function Item(params) {

    params = params || {};
    this.name = params.name || "n/a";
    this.data = params.data;

    this.sprites = params.sprites;

    this.frame    = 0;
	this.animated = this.sprites.length > 1;
}
module.exports = Item;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Item.prototype.addToInventory = function(inventory, classRef, i) {
    if (inventory[classRef][this.name]) {
        inventory.setCount(this, classRef, inventory[classRef][this.name].count + i);
    }
    
    else {
        inventory.pushToInventory(item, classRef, i);
    }
    
    
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Item.params.removeFromInventory = function(inventory, classRef, i) {
    if (!inventory[classRef][this.name]) {console.error("tried to remove item not in inventory"); return false;}

    if (inventory[classRef][this.name].count - i < 0) {
        console.error("tried to remove too many items");
        return false;
    }

    if (inventory[classRef][this.name].count - i == 0) {
        delete inventory[classRef][this.name];
        return true;
    }

    inventory.setCount(this, classRef, inventory.getCount(this, classRef) - i);
    return true;
}

