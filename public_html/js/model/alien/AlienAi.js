include('js/model/alien/AlienSpawner.js');

var AlienAi = Base.extend({
	constructor : function(id, actionPerSecond, spawnRate, game){
        this.base();
        this.id = id;
		this.spawner;
        this.units = {};
        this.actionPerSecond = actionPerSecond;
        this.spawnRate = spawnRate;

        this.decisionTime = 0;

        this.game = game;
	},

    draw : function(context, camera) {
        this.spawner.draw(context, camera);
        for(i in this.units) {
            this.units[i].draw(context, camera);
        }
    },

    takeDecision : function() {
    },
	
	update : function(framerate) {
        var newUnit = this.spawner.spawn(framerate);
        if(newUnit !== undefined) {
            this.units[''+newUnit.id] = newUnit;
        }
        this.decisionTime += framerate/1000;
        if(this.decisionTime >= this.actionPerSecond) {
            this.takeDecision();
            this.decisionTime = 0;
        }
		for(var i in this.units) {
            if(this.units[i+""].hitpoints <= 0){
                delete this.units[i+""];
            }
            else{
			    this.units[i+""].update(framerate);
            }
		}

	},

    select : function(position) {
        for(var u in this.units){
            var unit = this.units[u];
            if(unit.select(position.x, position.y)){
                return unit;
            }
        }

        if(this.spawner.select(position.x, position.y)) {
            return this.spawner;
        }

        return undefined;
    }
});