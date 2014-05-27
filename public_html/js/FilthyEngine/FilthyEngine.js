function include(filepath) { 
	document.write('<script type="text/javascript" src="'+filepath+'" ></script>');
}

include("js/FilthyEngine/Point.js");
include("js/FilthyEngine/Target.js");
include("js/FilthyEngine/Game.js");
include("js/FilthyEngine/View.js");
include("js/FilthyEngine/CanvasView.js");
include("js/FilthyEngine/World.js");
include("js/FilthyEngine/SocketConnection.js");

var FilthyEngine = Base.extend({
	constructor : function (containerId, fullscreen, alwaysRefresh) {
        this.containerId = containerId;
		this.fullscreen = fullscreen;
        this.alwaysRefresh = alwaysRefresh;
		this.views = [];
		this.currentView = "";

        this.socketConnections = [];
		//this.game = new Game(cameraWidth, cameraHeight, worldWidth, worldHeight);
		//this.view = new View(this.game, canvasId);

		//this.socketConnection = new SocketConnection(this);
	},
	
	init : function() {

	},

    setFullscreen : function(isFullscreen) {
        this.fullscreen = isFullscreen;
    },

    setAlwaysRefresh : function(isAlwaysRefresh) {
        this.alwaysRefresh = isAlwaysRefresh;
    },

    addView : function(viewName, view) {
        this.views[viewName] = view;
    },
	
	changeView : function(viewName) {
        if(this.views[viewName] != undefined) {
            $('#' + this.containerId).empty();
            $('#' + this.containerId).html(this.views[viewName].root);
            this.currentView = viewName;
            this.views[viewName].init();
            if(this.fullscreen)
                this.views[this.currentView].resize(window.innerWidth, window.innerHeight);
        }
	},

    getView : function(viewName) {
        return this.views[viewName];
    },
	
	loop : function(framerate) {
        if(this.alwaysRefresh) {
            if(this.currentView != "") {
                if(this.views[this.currentView] instanceof CanvasView) {
                    this.views[this.currentView].draw();
                }
            }
        }
	},
	
	onResize : function(width, height) {
		if(this.currentView != "") {
            if(this.fullscreen) {
                this.views[this.currentView].resize(window.innerWidth, window.innerHeight);
            }
            else {
                if(width != undefined && height != undefined)
                    this.views[this.currentView].resize(width, height);
            }
        }
		//this.game.camera.resize(window.innerWidth, window.innerHeight, this.game.world);
		//this.view.resize(this.game.camera);
	},

    createSocket : function(name, socketConnection) {
        this.socketConnections[name] = socketConnection;
    },

    getSocket : function(name) {
        return this.socketConnections[name];
    }
});