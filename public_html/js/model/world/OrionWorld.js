var OrionWorld = World.extend({
	constructor : function OrionWorld(data) {
		this.base(data['width'], data['height']);
		this.backgroundImage = new Image();
		this.backgroundImage.src = 'images/Orion_background_big.jpg';
		this.solarSystems = {};
        var c = 0;
		for(i in data['solarSystem']) {
			var ss = data['solarSystem'][i];
			this.solarSystems[i] = new SolarSystem(new Point(ss['sunX'], ss['sunY']), c, ss['planets']);
            c++;
		}
	},
	
	draw : function(context, camera) {
		this.base(this, context, camera);
		this.drawBackground(context);
		
		for(s in this.solarSystems) {
			this.solarSystems[s].draw(context, camera);
		}
	},
	
	drawBackground : function(context) {
		context.drawImage(this.backgroundImage, 0,0);
	},

    clickSelect : function(position) {
        for(var ss in this.solarSystems){
            for(var p in this.solarSystems[ss].planets){
                var planet = this.solarSystems[ss].planets[p];
                if(planet.select(position.x, position.y) == true) {
                    return planet;
                }
            }

            var sun = this.solarSystems[ss];
            if(sun.select(position.x, position.y) == true) {
                return sun;
            }

        }

        return undefined;
    }
});