var viewManager   = require('../viewManager');
var TextBox       = require('../TextBox');
var Texture = require('pixelbox/Texture');









var SCREEN_W = settings.screen.width;
var SCREEN_H = settings.screen.height;
var offset = 40;
var textbox = new TextBox(offset * 5, 24, assets.font.tetris).setColor(3);

var option = 1;
var item = 0;
var pageNumber = 1;
var invLength = 0;
var invRef = "weapons";
var numPages = 1;

//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.open = function (params) {
	params = params || {};
    this.params = params;
    textbox.clear();
    var y = 0;
    
    textbox.addText("WEAPONS", offset * (++y - 1) + 1, 12);
    textbox.addText("ARMOR", offset * (++y - 1) + 5, 12);
    textbox.addText("CONSUME", offset * (++y - 1) + 1, 12);
    textbox.addText("KEYITEMS", offset * (++y - 1), 12);

    this.wL = Object.keys(this.params.player.inventory.weapons).length || 0;
    this.aL = Object.keys(this.params.player.inventory.armor).length || 0;
    this.cL = Object.keys(this.params.player.inventory.consumables).length || 0;
    this.kL = Object.keys(this.params.player.inventory.keyItems).length || 0;

    //console.log(this.wL)


    //console.log(this.params.player);
    //console.log(this.params.player.inventory.getItem("weapons", 0 + (10 * (pageNumber - 1))));
    //console.log(this.params.player.inventory["weapons"][0 + (10 * (pageNumber - 1))]);
    invLength = this.wL;
    pageNumber = 1;
    option = 1;
    item = 0;
    invRef = "weapons";
    numPages = ~~(invLength / 11) + 1;
    if (invLength !== 0 && invLength % 11 == 0) numPages -= 1;
};


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
exports.update = function () {
    var tabSwitched = false;

    // user input - CHANGING INVENTORY TABS
    if (gamepad.btnp.left) {
        option -= 1; item = 0; pageNumber = 1; 
        if (option <= 0) {
            option = 4;
        }
        tabSwitched = true;

    }
    if (gamepad.btnp.right) {
        option += 1; item = 0; pageNumber = 1; 
        if (option > 4) {
            option = 1;
        }
        tabSwitched = true;
    }
    
    // inventory item list change (left or right pressed)
    if (tabSwitched) {
        switch (option) {
            case 1:
                invRef = "weapons"; 
                invLength = this.wL; 
                break;
            case 2:
                invRef = "armor"; 
                invLength = this.aL; 
                break;
            case 3:
                invRef = "consumables"; 
                invLength = this.cL; 
                break;
            case 4:
                invRef = "keyItems"; 
                invLength = this.kL; 
                break;
        }
        numPages = ~~(invLength / 11) + 1;
        
        if (invLength !== 0 && invLength % 11 == 0) numPages -= 1;

    }

    
    
    // inv background/ui
    paper(1);
    rectf(this.params.camera.x  + 4,  this.params.camera.y + 6 -2, offset * 4 + 6 + 4, SCREEN_H - 17 + 4);
    paper(0);
    rectf(this.params.camera.x + 6,  this.params.camera.y + 6, offset * 4 + 6, SCREEN_H - 17);
    paper(1) 
    rectf(this.params.camera.x  + 4, this.params.camera.y  + 24, offset * 4 + 6 + 4, 1);
    

    // inventory category highlight
    paper(4);
    rectf(this.params.camera.x + offset * (option - 1) + 8, this.params.camera.y + 8, offset + 2, 14)

    // category text
    draw(textbox.texture, this.params.camera.x + 10 + 4, this.params.camera.y);

    var x = 0;
    var spacing = 14;

    // item highlight
    pen(1);
    if (invLength > 0) {
        rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (item * spacing), offset * 2, 12);
    }

    // no items of the type in inventory - lock scrolling - display empty
    if (invLength == 0) {
        var txt = new Texture(offset * 2 - 5, 10);
        txt.print("EMPTY", 0, 0);
        draw(txt, this.params.camera.x + 11, this.params.camera.y + 24 + 3 + (0 * spacing) + 3);
    } 
    else {
        // scroll through items
        if (gamepad.btnp.down) {
            item += 1; 
            
            
            if (item > 10) {
                item = 0; pageNumber +=1; 
                if (pageNumber > numPages) {
                    pageNumber = 1; item = 0;
                }
            }

            if (!this.params.player.inventory.getInventoryItem(invRef, item + (11 * (pageNumber - 1)))) {
                pageNumber = 1; item = 0;
            }
        }
        if (gamepad.btnp.up) {
            item -= 1; 

            
            if (item < 0) {
                item = 10; pageNumber -=1; 
                if (pageNumber < 1) {
                    pageNumber = numPages; item = 10;}
            }

            if (!this.params.player.inventory.getInventoryItem(invRef, item + (11 * (pageNumber - 1)))) {
                pageNumber = numPages; item = invLength % 11 - 1;
            }
        }


        // render item names
        /**
         * @TODO : clean this shit up, make texture on page/category change, render texture every frame
         */
        var itemNum = (pageNumber == numPages) ? invLength % 11 : 11;
        for (var i = 0; i < itemNum; i++) {
            var invItemObj = this.params.player.inventory.getInventoryItem(invRef, i + (11 * (pageNumber - 1)));
            var txt = new Texture(offset * 2 - 5, 10);
            txt.print(invItemObj.data.name, 0, 0);
            draw(txt, this.params.camera.x + 11, this.params.camera.y + 24 + 3 + (i * spacing) + 3)
        }

        // item quantity display
        
        var txt = new Texture(offset * 2, 14);
        var invItemObj = this.params.player.inventory.getInventoryItem(invRef, item + (11 * (pageNumber - 1)));
        txt.print("QTY: " + invItemObj.count, 0, 0);
        draw(txt, this.params.camera.x + offset * 2 + 10, this.params.camera.y + 30);

        // item icon background
        paper (4);
        rectf(this.params.camera.x + offset * 2 + 12 + 17 + 82/2 - (18), this.params.camera.y + 27, 36, 36);
        paper(1);
        rectf(this.params.camera.x + offset * 2 + 12 + 18 + 82/2 - (18), this.params.camera.y + 28, 34, 34);

        // item icon rendering
        if (invItemObj.data.sprites) {
            draw(invItemObj.data.sprites[0], 0, 0);
            
        }
        else {
            
            
            draw(assets.entity[invRef], this.params.camera.x + offset * 2 + 12 + 18 + 82/2 - (18) + 1, this.params.camera.y + 28);
           
        }
        


        //console.log(((this.params.camera.x + 6) + (offset * 4 + 6)) - (this.params.camera.x + offset * 2 + 10))
        // render item icon
        //console.log(this.params);
    }





    // page number display
    paper(0);
    pen(1);
    rect(this.params.camera.x + 7, this.params.camera.y + SCREEN_H - 9, offset + 3, 9)
    rectf(this.params.camera.x + 8, this.params.camera.y + SCREEN_H - 9, offset + 1, 8)
    var txt = new Texture(offset * 2, 10);
    txt.print("PAGE: " + pageNumber + "/" + numPages, 0, 0);
    draw(txt, this.params.camera.x + 11, this.params.camera.y + SCREEN_H - 8);

    

    /* 
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    rect(this.params.camera.x + 8, this.params.camera.y + 24 + 3 + (x++ * spacing), offset * 2, 12);
    */


    if (gamepad.btnr.start) {
        viewManager.open("game", this.params);
    }
};