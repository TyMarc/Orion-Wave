var Builder = Unit.extend({
	constructor : function(id, playerId, position, color) {
		this.base(id, playerId, position, 200, color);
		
		this.id = id;
		this.playerId = playerId;
		this.moveSpeed = 150;
		this.orientation = 0;
		this.colorId = color;
        this.buildSpeed = 30;

	    this.image.src = "images/Builder/builder" + color + ".png"
	},

    update : function(framerate, player) {
        this.base(framerate, player);
        if(this.flag.flagState == FlagState.BUILD) {
            this.build(this.flag.finalTarget, framerate);
        }
    },

    build : function(building, framerate) {
        if(Utils.calcDistance(this.position, building.position) >= this.moveSpeed*framerate/1000) {
            this.move(framerate);
        }
        else {
            var endPos = new Point(this.flag.finalTarget.position.x, this.flag.finalTarget.position.y);
            this.position = endPos;

            if(building.buildingTimer < building.buildTime){
                building.buildingTimer += this.buildSpeed*framerate/1000;
                building.hitpoints += (1/building.buildTime)*building.maxHitpoints;
            }
            else{
                building.finished = true;
                if(building.hitpoints >= building.maxHitpoints -1){
                    building.hitpoints = building.maxHitpoints;
                    this.flag.flagState = FlagState.STANDBY;
                }
            }
        }
    }
});
