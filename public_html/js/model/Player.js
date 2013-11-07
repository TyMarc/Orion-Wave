var Player = Base.extend({
	constructor : function(uid, name, color, mothership){
		this.uid = uid;
		this.name = name;
		this.colorId = color;
		this.resources = new Resources();
        this.mothership = new MotherShip(new Point(mothership['x'], mothership['y']), 5000, this.colorId);
		this.units = {};
		this.buildings = {};
		this.camera = undefined;
	},

    draw : function(context, camera, selectedUnits) {
        for(var b in this.buildings) {
            context.save();
            this.buildings[b].draw(context, camera, selectedUnits);
            context.restore();
        }

        this.mothership.draw(context, camera, selectedUnits);

        for(var i in this.units) {
            context.save();

            this.units[i].draw(context, camera, selectedUnits);
            context.restore();
        }

    },
	
	update : function(framerate, world, selectedUnits) {
        this.mothership.update(framerate, world);
        if(this.mothership.overSun != undefined) {
            if(this.mothership.overSun.energy > 0) {
                var amount = Math.floor(this.mothership.energyCollectRate * framerate / 1000);
                this.mothership.overSun.energy -= amount;
                this.resources.energy += amount;
            }
        }
		for(var i in this.units) {
            if(this.units[i].hitpoints <= 0){
                delete this.units[i];
                delete selectedUnits[i];
            }
            else{
			    this.units[i].update(framerate, this);
            }
		}
        for(var b in this.buildings) {
            this.buildings[b].update(framerate);
        }
	},

    clickSelect : function(position) {
        var selectedStuff = new Array();

        for(var u in this.units){
            var unit = this.units[u];
            if(unit.select(position.x, position.y)){
                selectedStuff.push(unit);
                break;
            }
        }

        if(this.mothership.select(position.x, position.y)) {
            var selectedStuff = new Array();
            selectedStuff.push(this.mothership);
        }

        if(selectedStuff.length == 0) {
            for(var b in this.buildings){
                var building = this.buildings[b];
                if(building.select(position.x, position.y)){
                    selectedStuff.push(building);
                    break;
                }
            }
        }

            return selectedStuff;
    },

    selectBuilding : function(position) {

        if(this.mothership.select(position.x, position.y)) {
            return this.mothership;
        }

        for(var b in this.buildings){
            var building = this.buildings[b];
            if(building.select(position.x, position.y)){
                return building;
            }
        }

        return undefined;
    },

    canAfford : function(buildCost) {
        if(this.resources.hydrogen >= buildCost.hydrogen){
            if(this.resources.energy >= buildCost.energy){
                return true;
            }
        }

        return false;
    },

    buy : function(buildCost) {
        this.resources.hydrogen -= buildCost.hydrogen;
        this.resources.energy -= buildCost.energy;
    }
});