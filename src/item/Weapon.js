var Texture = require('pixelbox/Texture');
var Inventory = require('../Inventory');
var Item = require('./Item');

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

function Weapon(params) {
    Item.call(this, params);
    params = params || {};
    
    this.attack = params.attack || 1;
    this.value = params.value || 1;
    this.modifiers = params.modifiers;
    this.aura = params.aura;
}

inherits(Weapon, Item);
module.exports = Weapon;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Weapon.prototype.addToInventory = function(inventory, i) {
    Item.prototype.addToInventory.call(inventory, "weapons", i);

}

/**
 * @param i - amount to remove
 */
//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
Weapon.prototype.removeFromInventory = function(inventory, i) {
    Item.prototype.removeFromInventory.call(inventory, "weapons", i);


}