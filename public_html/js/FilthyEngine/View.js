/**
 * A view is essentially a HTML partial.
 * You can instantiate one by giving :
 * The partial full URL (i.e. "partials/myPartial.htm")
 * The rootId of the HTML partial (The Id of the root element)
 * The callback is used for bindings purpose when initialized
 */
var View = Base.extend({
	constructor : function(partialURL, rootId, callback) {
		this.partialURL = partialURL;
		this.root = "";
		this.rootId = '#'+rootId;
		var that = this;
		$.get(partialURL, function(data) {
			that.root = data;
			if(callback !== undefined)
				callback();
		});
	},

    init : function() {

    },
	
	resize : function(newWidth, newHeight) {
		$(this.rootId).width(newWidth);
		$(this.rootId).height(newHeight);
	}
});