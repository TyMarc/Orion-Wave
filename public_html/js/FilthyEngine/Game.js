include("js/FilthyEngine/Camera.js");

var Game = Base.extend({
	constructor : function(cameraWidth, cameraHeight, world) {
		this.camera = new Camera(cameraWidth, cameraHeight);
		this.world = world;
        this.currentFrame = 0;
        this.wait = false;

        /*****FrameCheckingOnly******/
        this.serverFrame;
        this.lowestUid;
	},
	
	draw : function(context) {
		this.world.draw(context, this.camera);
	},

    wait : function(serverFrame, lowestUid) {
        this.serverFrame = serverFrame;
        this.lowestUid = lowestUid;
        this.wait = true;
    },

    doneWaiting : function() {
        this.serverFrame = 0;
        this.lowestUid = 0;
        this.wait = false;
    },

	update : function(framerate) {
        this.camera.update(this.world);
        this.currentFrame+=framerate;
	},
	
	keypress : function(key) {
	},
	
	keyrelease : function(key) {
	
	}
});