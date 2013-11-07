BuildingCost = {
    EXTRACTOR:new Resources(0,2000)
}

var Building = PlayerObject.extend({
    constructor : function Building(id, position, hitpoints, buildTime, buildName, image){
        this.base(position, hitpoints);

        this.id = id;
        this.image = image;
        this.buildTime = buildTime;
        this.buildName = buildName;
        this.buildingTimer = 0;
        this.orientation = 0;
        this.rotateSpeed = Math.random()*0.03;
        this.maxHitpoints = hitpoints;
        this.hitpoints = 1;
        this.constructionImage = new Image();
        this.constructionImage.src="images/building_construction.png";

    },

    draw : function(context, camera, selectedUnits) {
        if(camera.isInViewport(this.position, this.image.width, this.image.height)) {

            var relativePosition = camera.calculateRelativePosition(this.position);

            context.translate(relativePosition.x, relativePosition.y);

            if(Utils.contains(selectedUnits, this)) {
                //On dessine un cercle autour de l'unité si elle est sélectionnée
                context.beginPath();
                context.fillStyle = "rgba(255, 255, 255, 0.2)";
                context.arc(0, 0, (this.image.width/2), 0, Math.PI*2, true);
                context.fill();
                context.lineWidth = 1;
                context.strokeStyle = Utils.getColor(this.colorId);
                context.stroke();
                context.closePath();
                context.fillStyle = "rgba(255, 255, 255, 1)";
                context.translate(-30,-(this.image.width/2)-5);
                context.fillText(this.buildName, 0, 0);
                context.translate(30,(this.image.width/2)+5);
                context.translate(-30,-(this.image.width/2)-20);
                if(this.buildingTimer < this.buildTime){
                    context.fillText(Math.floor((this.hitpoints/this.maxHitpoints)*100) + "%", 0, 0);
                }
                else{
                    context.fillText(this.hitpoints + " / " + this.maxHitpoints, 0, 0);
                }
                context.translate(30,(this.image.width/2)+20);
            }

            context.rotate(this.orientation);

            if(this.buildingTimer < this.buildTime) {
                  context.drawImage(this.constructionImage, -(this.image.width/2), -(this.image.height/2));
            } else {
                  context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
            }
        }
    },

    update : function(framerate) {
        if(this.buildingTimer < this.buildTime){
            this.orientation += (this.buildingTimer/this.buildTime)*0.15;
        } else{
            this.orientation += this.rotateSpeed;
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

    finish : function() {
        return (this.buildingTimer >= this.buildTime)
    }
});