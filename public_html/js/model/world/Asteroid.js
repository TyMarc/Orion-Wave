var Asteroid = Target.extend({
	constructor : function(position) {
		this.base(position);
		this.width = 30;
		this.height = 31;
		this.image = new Image();
		this.image.src = "images/asteroid.gif";
	},
	
	draw : function(context, camera) {
		if(camera.isInViewport(this.position, this.width, this.height)) {
			var relativePosition = camera.calculateRelativePosition(this.position);
			context.drawImage(this.image, relativePosition.x-(this.image.width/2), relativePosition.y-(this.image.height/2));
		}
	}
});