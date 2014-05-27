UnitCost = {
    CARGO:new Resources(0,2000),
    BUILDER:new Resources(0,3000),
    ATTACK:new Resources(500,3000)
}

var Unit = PlayerObject.extend({
	constructor : function Unit(id, playerId, position, hitpoints, color) {
		this.base(position, hitpoints);
		
		this.id = id;
		this.playerId = playerId;
		this.moveSpeed = 300;
		this.orientation = 0;
		this.colorId = color;
		
		this.image = new Image();
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
				context.arc(0, 0, this.image.width/2, 0, Math.PI*2, true);
				context.fill();
				context.lineWidth = 0.5;
				context.strokeStyle = Utils.getColor(this.colorId);
				context.stroke();
				context.closePath();
                context.fillStyle = "rgba(255, 255, 255, 1)";
                context.translate(-30,-(this.image.width/2)-5);
                context.fillText(this.hitpoints + " / " + this.maxHitpoints, 0, 0);
                context.translate(30,(this.image.width/2)+5);
			}
		
			context.rotate(this.orientation);
		
			context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));

            context.restore();
        }
	},
	
	update : function(framerate, player) {
		if(this.flag.flagState == FlagState.MOVE) {
			this.move(framerate);
		}
	},
	
	move : function(framerate) {
		var newMoveSpeed = Utils.unitPerSecondToPerFramerate(this.moveSpeed, framerate);
		
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
		if(x >= this.position.x - (this.image.width/2) && x <= (this.position.x + (this.image.width/2))){
			if(y >= this.position.y - (this.image.height/2) && y <= (this.position.y + (this.image.height/2))){
				return true;
			}
		}
		return false;
	},
	
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
	}
});
