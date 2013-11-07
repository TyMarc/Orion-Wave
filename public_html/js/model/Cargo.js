var Cargo = Unit.extend({
	constructor : function(id, playerId, position, color) {
        this.base(id, playerId, position, 150, color);
		
		this.id = id;
		this.playerId = playerId;
		this.moveSpeed = 150;
		this.orientation = 0;
		this.colorId = color;
        this.pods = [];
        this.maxPods = 6;

		this.image.src = "images/Cargo/cargo" + color + ".png";

        this.image_full = new Image();
        this.image_full.src = "images/Cargo/cargo" + color + "_full.png";
	},

    draw : function(context, camera, selectedUnits) {
        this.base(context, camera, selectedUnits);
        if(camera.isInViewport(this.position, this.image.width, this.image.height)) {
            if(this.pods.length > 0) {
                context.drawImage(this.image_full, -(this.image.width/2), -(this.image.height/2));
            } else {
                context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
            }
        }
    },

    update : function(framerate, player) {
        this.base(framerate, player);
        if(this.flag.flagState == FlagState.GATHER) {
            this.gather(this.flag.finalTarget, framerate, player);
        }
    },

    gather : function(finalTarget, framerate, player) {
        if(Utils.calcDistance(this.position, finalTarget.position) >= this.moveSpeed*framerate/1000) {
            this.move(framerate);
        }
        else {
            var endPos = new Point(this.flag.finalTarget.position.x, this.flag.finalTarget.position.y);
            this.position = endPos;
            if(finalTarget instanceof Extractor) {
                if(finalTarget.pods.length == 0) {
                    if(this.pods.length == 0)
                        this.flag.flagState = FlagState.STANDBY;
                    else {
                        this.flag.initialTarget = this.flag.finalTarget;
                        this.flag.finalTarget = player.mothership;
                    }
                }
                while(finalTarget.pods.length > 0 && this.pods.length < this.maxPods) {
                    var tmp = finalTarget.pods.splice(0, 1);
                    this.pods.push(tmp[0]);
                }
                this.flag.initialTarget = this.flag.finalTarget;
                this.flag.finalTarget = player.mothership;
            } else if(finalTarget instanceof MotherShip) {
                while(this.pods.length > 0) {
                    var tmp = this.pods.splice(0, 1);
                    player.resources.hydrogen += tmp[0].hydrogen;
                }
                this.flag.flagState = FlagState.STANDBY;
            }
        }
    }
});
