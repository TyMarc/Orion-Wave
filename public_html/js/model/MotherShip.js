var MotherShip = PlayerObject.extend({
	constructor : function Unit(position, hitpoints, color) {
		this.base(position, hitpoints);

		this.moveSpeed = 20;
		this.orientation = 0;
        this.colorId = color;

        this.overSun = undefined;
		this.energyCollectRate = 500;

		this.image = new Image();
		this.image.src = "images/Motherships/mothership"+color+".png";

        this.image_empty = new Image();
        this.image_empty.src = "images/Motherships/mothership"+color+"_empty.png";
	},
	
	draw : function(context, camera, selectedUnits) {

		if(camera.isInViewport(this.position, this.image.width, this.image.height)) {
            context.save();
			var relativePosition = camera.calculateRelativePosition(this.position);

			context.translate(relativePosition.x, relativePosition.y);

			if(Utils.contains(selectedUnits, this)) {
				//On dessine un cercle autour de l'unité si elle est sélectionnée
				context.beginPath();
				context.fillStyle = "rgba(255, 255, 255, 0.1)"
				context.arc(0, 0, this.image.width/4, 0, Math.PI*2, true);
				context.fill();
				context.lineWidth = 0.5;
				context.strokeStyle = Utils.getColor(this.colorId);
				context.stroke();
				context.closePath();
                context.fillStyle = "rgba(255, 255, 255, 1)";
                context.translate(-50,-(this.image.width/4)-10);
                context.fillText(this.hitpoints + " / " + this.maxHitpoints, 0, 0);
                context.translate(50,(this.image.width/4)+10);
			}

            if(this.overSun && this.overSun.energy > 0) {
                context.drawImage(this.image_empty, -(this.image.width/2), -(this.image.height/2));
            } else {
                context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
            }
            context.restore();

		}
	},
	
	update : function(framerate, world) {
		if(this.flag.flagState == FlagState.MOVE) {
			this.move(framerate);
		}
        var overSun = undefined;
        for(var ss in world.solarSystems) {
            var sun = world.solarSystems[ss];
            if(this.position.x <= sun.position.x + sun.sunWidth/2 && this.position.x >= sun.position.x - sun.sunWidth/2) {
                if(this.position.y <= sun.position.y + sun.sunHeight/2 && this.position.y >= sun.position.y - sun.sunHeight/2) {
                    overSun = sun;
                }
            }
        }
        this.overSun = overSun;
	},
	
	move : function(framerate) {
		newMoveSpeed = Utils.unitPerSecondToPerFramerate(this.moveSpeed, framerate);
		
		/*
		Si la distance entre la position courante et la position de la cible finale est plus petite 
		que la vitesse de déplacement, on ne fait que mettre la position à la cible finale
		*/
		if(Utils.calcDistance(this.position, this.flag.finalTarget.position) <= newMoveSpeed) {
			this.position = new Point(this.flag.finalTarget.position.x, this.flag.finalTarget.position.y);
			this.flag.flagState = FlagState.STANDBY;
		}
		else {
			var angle = Utils.calcAngle(this.position, this.flag.finalTarget.position);
			var temp = Utils.getAngledPoint(angle, newMoveSpeed, this.position.x, this.position.y);
			this.orientation = angle + (Math.PI/2);
			this.position.x = temp.x;
			this.position.y = temp.y;
		}
	},
    
	select : function(x, y){
		if(x >= this.position.x - (this.image.width/4) && x <= (this.position.x + (this.image.width/4))){
			if(y >= this.position.y - (this.image.height/4) && y <= (this.position.y + (this.image.height/4))){
				return true;
			}
		}
		return false;
	}
	  /*
	boxSelect : function(positionStart, positionEnd){
		if(positionStart.x > positionEnd.x){
			var xTempo = positionStart.x;
			positionStart.x = positionEnd.x;
			positionEnd.x = xTempo;
		}
		if(positionStart.y > positionEnd.y){
			var yTempo = positionStart.y;
			positionStart.y = positionEnd.y;
			positionEnd.y = yTempo;
		}
		
		if(this.position.x >= positionStart.x && this.position.x <= positionEnd.x){
			if(this.position.y >= positionStart.y && this.position.y <= positionEnd.y){
				return true;
			}
		}
		
		return false;
	}  */
});
