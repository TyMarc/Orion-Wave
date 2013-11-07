var Point = require("./Point.class");
var SolarSystem = require("./SolarSystem.class");

function OrionWorld(width, height) {
		this.width = width;
		this.height = height;
		this.solarSystems = {};
		this.generateWorld();
	}
	 

OrionWorld.prototype.generateWorld = function() {
	for(var i = 0; i< 15; i++) {
		var wPositionOk = false;
		var sunX;
		var sunY;
		while(!wPositionOk) {
			wPositionOk = true;
			sunX = Math.floor((Math.random()*(this.width-500)) + 250)-this.width/2;
			sunY = Math.floor((Math.random()*(this.height-500)) + 250)-this.height/2;
			for(s in this.solarSystems) {
				if(sunX > this.solarSystems[s].position.x - this.solarSystems[s].width && sunX < this.solarSystems[s].position.x + this.solarSystems[s].width ) {
					if(sunY > this.solarSystems[s].position.y - this.solarSystems[s].height && sunY < this.solarSystems[s].position.y + this.solarSystems[s].height) {
						wPositionOk = false;
						break;
					}
				}
			}
		}
		this.solarSystems[i] = new SolarSystem(new Point(sunX,sunY));
	}
	console.log('World generation completed');
}

OrionWorld.prototype.toJSON = function() {
    var array = {};
    array['width'] = this.width;
    array['height'] = this.height;
    array['solarSystem'] = {};
    
	for(i in this.solarSystems) {
		array['solarSystem'][i] = {sunX:this.solarSystems[i].position.x, sunY:this.solarSystems[i].position.y, planets:{}, asteroids:{}, nebulas:{}};
        for(j in this.solarSystems[i].planets) {
            array['solarSystem'][i]['planets'][j] = {x:this.solarSystems[i].planets[j].position.x, y:this.solarSystems[i].planets[j].position.y}
        }
        /*for(j in this.solarSystems[i].asteroids) {
            array['solarSystem'][i]['asteroids'][j] = {x:this.solarSystems[i].asteroids[j].position.x, y:this.solarSystems[i].asteroids[j].position.y}
        }
        for(j in this.solarSystems[i].nebulas) {
            array['solarSystem'][i]['nebulas'][j] = {x:this.solarSystems[i].nebulas[j].position.x, y:this.solarSystems[i].nebulas[j].position.y}
        } */
	}
	return array;
}

module.exports = OrionWorld;