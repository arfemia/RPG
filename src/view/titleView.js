var viewManager = require('../viewManager');
var TextBox = require('../TextBox');
//var Gamepad = require('pixelbox/gamepad');
//var gamepad = Gamepad.gamepad;


var SCREEN_HEIGHT = settings.screen.height;
var SCREEN_WIDTH = settings.screen.width;
var OPTIONS_COUNT = 2;
var OPTIONS_Y = 88;

// assets
// var BACKGROUND = getMap('title/background');
var CURSOR = assets.hud.cursor;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄

var option = 0;

var textbox = new TextBox(128, 16, assets.font.tetris).setColor(3);

function updateText() {

    var y = 0;
    textbox.clear();
    textbox.addText('START GAME', 0, 8 * y++);
    textbox.addText('EXIT', 0, 8 * y++);

}


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.open = function() {

    // TODO: title animation

    camera(0, 0);
    paper(2);
    updateText();

    // TODO: music init
}

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
function action() {
    switch (option) {
        case 0: viewManager.open('game', {levelId : 'test'}); break;
        case 1: break;
    }

}



//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.update = function() {
    cls();
    

    // menu
    draw(textbox.texture, (SCREEN_WIDTH / 2) - textbox.texture.width / 4 , SCREEN_HEIGHT / 4);
    draw(CURSOR, (SCREEN_WIDTH / 2) - 16 - textbox.texture.width / 4, option * 8 + SCREEN_HEIGHT / 4 - 2);

    // inputs
    if (gamepad.btnp.down ) {
        option += 1; if (option >= OPTIONS_COUNT) option = 0; }
    if (gamepad.btnp.up   ) { option -= 1; if (option < 0) option = OPTIONS_COUNT - 1; }
    
     action
    if (gamepad.btnp.A) action();
    //if (gamepad.btnp.B) action();
}