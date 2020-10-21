var viewManager   = require('../viewManager');
var TextBox       = require('../TextBox');
var Texture = require('pixelbox/Texture');


var ASSET = assets.fade.frame1;
var frame = 0;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
var textbox = new TextBox(160, 24, assets.font.tetris).setColor(3);
//var img = new Texture(screen.settings.w)
var timer = 0;


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.open = function (params) {
	params = params || {};
    this.params = params;
	textbox.clear();
	
	// TODO center text ?
	//textbox.addText('CHAPTER ' + params.chapter, 8, 0);
	//textbox.addText(params.title, 8, 16);
	//if (params.camera) {camera(params.camera.x, params.camera.y);}
	
	
	//draw(textbox.texture, 0, 64);
	this.params.player.draw();
	timer = 0;
	frame = 0;
};

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.update = function () {
	// lock screen for few frames
	if (++timer < 10) {
		
        //draw(textbox.texture, 0, 64);
        this.params.player.draw();
		return;
	};

	if (timer >= ((frame + 1) / 6) * 60) {
		
		frame += 1;
	}
	if (frame >= 7) frame = 6;
	ASSET = assets.fade['frame' + frame];

	

	this.params.player.draw();
	draw(ASSET, this.params.camera.x, this.params.camera.y);
	
	// action
	if (timer >= 75
	 || gamepad.btnp.A
	 || gamepad.btnp.B
	 || gamepad.btnp.start) viewManager.open('game', this.params);
};