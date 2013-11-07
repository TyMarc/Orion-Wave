var SolarSystem = Target.extend({
	constructor : function SolarSystem(position, id, planetsData) {
        this.id = id;
		this.base(position);
		this.width = 300;
		this.height = 300;
        this.sunWidth = 115;
        this.sunHeight = 115;
        this.energy = 100000;
		this.image = new Image();
        this.image.src = "images/sun.png";
		this.planets = {};
        var c = 0;
		for(i in planetsData) {
			this.planets[i] = new Planet(new Point(planetsData[i]['x'], planetsData[i]['y']), c, this.id);
            c++;
		}
        this.opacity = 0.99;
        this.opacityDown = true;
		/*this.asteroids = {};
		for(i in asteroidsData) {
			this.asteroids[i] = new Asteroid(new Point(asteroidsData[i]['x'],asteroidsData[i]['y']));
		}
		this.nebulas = {};
		for(i in nebulasData) {
			this.nebulas[i] = new Nebula(new Point(nebulasData[i]['x'],nebulasData[i]['y']));
		}*/
	}, 
	
	draw : function(context, camera) {
		if(camera.isInViewport(this.position, this.width, this.height)) {
			var relativePosition = camera.calculateRelativePosition(this.position);
            if(this.energy > 0){
                if(this.opacityDown){
                    this.opacity -= 0.01;
                    if(this.opacity <= 0.9){
                        this.opacityDown = false;
                    }
                }
                else{
                    this.opacity += 0.01;
                    if(this.opacity >= 0.99){
                        this.opacityDown = true;
                    }
                }
                context.globalAlpha = this.opacity;
                context.drawImage(this.image, relativePosition.x-(this.image.width/2), relativePosition.y-(this.image.height/2));
                context.globalAlpha = 1;
            }
		}
		for(p in this.planets) {
			this.planets[p].draw(context, camera);
		}
		/*for(a in this.asteroids) {
			this.asteroids[a].draw(canvas, context, camera);
		}
		for(n in this.nebulas) {
			this.nebulas[n].draw(canvas, context, camera);
		}*/
	},

    select : function(x, y){
        if(x >= this.position.x - (this.image.width) && x <= (this.position.x + (this.image.width))){
            if(y >= this.position.y - (this.image.height) && y <= (this.position.y + (this.image.height))){
                return true;
            }
        }
        return false;
    }
});