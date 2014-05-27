OrionView = CanvasView.extend({
	constructor : function (partialURL, rootId, callback) {
		this.base(partialURL, rootId, callback);
        this.game;
	},
	
	draw : function() {
		this.game.draw(this.context['game_canvas']);
	},

    resize: function(width, height) {
        this.base();
        this.canvas['game_canvas'].width = width;
        this.canvas['game_canvas'].height = height;
    }
});