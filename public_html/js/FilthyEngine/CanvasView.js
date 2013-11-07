var CanvasView = View.extend({
	constructor : function (partialURL, rootId, callback) {
        this.base(partialURL, rootId, callback);
        this.canvas = {};
        this.context = {};
        /*
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext("2d");
		this.canvas.width = game.camera.width;
		this.canvas.height = game.camera.height;*/
	},
	
	draw : function() {

	}
});