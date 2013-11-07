var Point = require("./Point.class");
var Asteroid = require("./Asteroid.class");
var Nebula = require("./Nebula.class");
var Planet = require("./Planet.class");
	
function SolarSystem(position) {
	this.position = position;
	this.width = 1200;
	this.height = 1200;
	this.sunWidth = 300;
	this.sunHeight = 300;
	this.planets = {};
	this.asteroids = {};
	this.nebulas = {};
	this.generateSolarSystem = function() {
        var nbPlanets = (Math.floor(Math.random())*3)+4;
		for(var i = 0; i<nbPlanets; i++) {
			var planetX;
			var planetY;
			var wPlanetPositionOk = false;
			while(!wPlanetPositionOk) {
				wPlanetPositionOk = true;
				planetX = Math.floor((Math.random()*this.width) + 1) - this.width/2 + this.position.x;
				planetY = Math.floor((Math.random()*this.height) + 1) - this.height/2 + this.position.y;
				if(planetX > this.position.x - this.sunWidth/2 && planetX < this.position.x + this.sunWidth/2) {
					if(planetY > this.position.y - this.sunHeight/2 && planetY < this.position.y + this.sunHeight/2) {
						wPlanetPositionOk = false;
					}
				}
				if(wPlanetPositionOk) {
					for(s in this.planets) {
						if(planetX > this.planets[s].position.x - this.planets[s].width && planetX < this.planets[s].position.x + this.planets[s].width) {
							if(planetY > this.planets[s].position.y - this.planets[s].height && planetY < this.planets[s].position.y + this.planets[s].height) {
								wPlanetPositionOk = false;
								break;
							}
						}
					}
				}
			}
			this.planets[i] = new Planet(new Point(planetX,planetY));
		}
		/*for(var i = 0; i<2; i++) {
			var asteroidX;
			var asteroidY;
			var wAsteroidPositionOk = false;
			while(!wAsteroidPositionOk) {
				wAsteroidPositionOk = true;
				asteroidX = Math.floor((Math.random()*this.width) + 1) - this.width/2 + this.position.x;
				asteroidY = Math.floor((Math.random()*this.height) + 1) - this.height/2 + this.position.y;
				
				if(asteroidX > this.position.x - this.sunWidth/2 && asteroidX < this.position.x + this.sunWidth/2) {
					if(asteroidY > this.position.y - this.sunHeight/2 && asteroidY < this.position.y + this.sunHeight/2) {
						wAsteroidPositionOk = false;
					}
				}
				
				if(wAsteroidPositionOk) {
					for(s in this.planets) {
						if(asteroidX > this.planets[s].position.x - this.planets[s].width && asteroidX < this.planets[s].position.x + this.planets[s].width) {
							if(asteroidY > this.planets[s].position.y - this.planets[s].height && asteroidY < this.planets[s].position.y + this.planets[s].height) {
								wAsteroidPositionOk = false;
								break;
							}
						}
					}
					if(wAsteroidPositionOk) {
						for(a in this.asteroids) {
							if(asteroidX > this.asteroids[a].position.x - this.asteroids[a].width && asteroidX < this.asteroids[a].position.x + this.asteroids[a].width) {
								if(asteroidY > this.asteroids[a].position.y - this.asteroids[a].height && asteroidY < this.asteroids[a].position.y + this.asteroids[a].height) {
									wAsteroidPositionOk = false;
									break;
								}
							}
						}
					}
				}
			}
			this.asteroids[i] = new Asteroid(new Point(asteroidX,asteroidY));
		}
		for(var i = 0; i<2; i++) {
			var nebulaX;
			var nebulaY;
			var nebulaPositionOk = false;
			while(!nebulaPositionOk) {
				nebulaPositionOk = true;
				nebulaX = Math.floor((Math.random()*this.width) + 1) - this.width/2 + this.position.x;
				nebulaY = Math.floor((Math.random()*this.height) + 1) - this.height/2 + this.position.y;
				
				if(nebulaX > this.position.x - this.sunWidth/2 && nebulaX < this.position.x + this.sunWidth/2) {
					if(nebulaY > this.position.y - this.sunHeight/2 && nebulaY < this.position.y + this.sunHeight/2) {
						nebulaPositionOk = false;
					}
				}
				if(nebulaPositionOk) {
					for(s in this.planets) {
						if(nebulaX > this.planets[s].position.x - this.planets[s].width && nebulaX < this.planets[s].position.x + this.planets[s].width) {
							if(nebulaY > this.planets[s].position.y - this.planets[s].height && nebulaY < this.planets[s].position.y + this.planets[s].height) {
								nebulaPositionOk = false;
								break;
							}
						}
					}
					if(nebulaPositionOk) {
						for(a in this.asteroids) {
							if(nebulaX > this.asteroids[a].position.x - this.asteroids[a].width && nebulaX < this.asteroids[a].position.x + this.asteroids[a].width) {
								if(nebulaY > this.asteroids[a].position.y - this.asteroids[a].height && nebulaY < this.asteroids[a].position.y + this.asteroids[a].height) {
									nebulaPositionOk = false;
									break;
								}
							}
						}
					
						if(nebulaPositionOk) {
							for(a in this.nebulas) {
								if(nebulaX > this.nebulas[a].position.x - this.nebulas[a].width && nebulaX < this.nebulas[a].position.x + this.nebulas[a].width) {
									if(nebulaY > this.nebulas[a].position.y - this.nebulas[a].height && nebulaY < this.nebulas[a].position.y + this.nebulas[a].height) {
										nebulaPositionOk = false;
										break;
									}
								}
							}
						}
					}
				}
			}
			this.nebulas[i] = new Nebula(new Point(nebulaX,nebulaY));
		}*/
	}
	this.generateSolarSystem();
}

module.exports = SolarSystem;