

var viewManager = require('./viewManager');
viewManager.addView('title', require('./view/titleView'));
viewManager.addView('game',  require('./view/gameView'));
viewManager.addView('intermission', require('./view/fadeIntermissionView'));
viewManager.addView('inventory', require('./view/inventoryView'));

// viewManager.addView('viewName', require('./view/viewName'));



viewManager.open('title');


//▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
// Update is called once per frame
exports.update = viewManager.update;
