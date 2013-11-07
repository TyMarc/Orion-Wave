var Planet = Target.extend({
	constructor : function Planet(position, id, solarSystemId) {
		this.base(position);
        this.id = id;
        this.solarSystemId = solarSystemId
		this.width = 250;
		this.height = 250;
		this.image = new Image();
		this.image.src = "images/planet.png";
        this.hydrogen = 50000;
        this.opacity = 0.99;
        this.opacityDown = true;
	},
	
	draw : function (context, camera) {
		if(camera.isInViewport(this.position, this.width, this.height)) {
			var relativePosition = camera.calculateRelativePosition(this.position);

            if(this.opacityDown){
                this.opacity -= 0.005;
                if(this.opacity <= 0.85){
                    this.opacityDown = false;
                }
            }
            else{
                this.opacity += 0.005;
                if(this.opacity >= 0.99){
                    this.opacityDown = true;
                }
            }
            context.globalAlpha = this.opacity;
			context.drawImage(this.image, relativePosition.x-(this.image.width/2), relativePosition.y-(this.image.height/2));
            context.globalAlpha = 1;
		}
	},

    select : function(x, y){
        if(x >= this.position.x - (85) && x <= (this.position.x + (85))){
            if(y >= this.position.y - (85) && y <= (this.position.y + (85))){
                return true;
            }
        }
        return false;
    }
});