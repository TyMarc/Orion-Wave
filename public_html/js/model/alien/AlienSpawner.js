var AlienSpawner = PlayerObject.extend({
    constructor : function(position, spawnRate, alienId, hitpoints) {
        this.base(position, hitpoints);
        this.spawnRate = spawnRate;

        this.currentSpawn = 0;
        this.spawnCounter = 0;

        this.alienId = alienId;

        this.image = new Image();
    },

    draw : function(context, camera) {
        if(camera.isInViewport(this.position, this.image.width, this.image.height)) {
            var relativePosition = camera.calculateRelativePosition(this.position);
            context.save();
            context.translate(relativePosition.x, relativePosition.y);
            context.rotate(this.orientation);
            context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
            context.restore();
        }
    },

    spawn : function (framerate) {
        var unit = undefined;
        this.currentSpawn += framerate/1000;
        if(this.currentSpawn >= this.spawnRate) {
            this.currentSpawn = this.spawnRate;
            unit = this.createUnit();
            this.spawnCounter++;
            this.currentSpawn = 0;
        }
        return unit;
    },

    createUnit : function() {

    },

    select : function(x, y){
        if(x >= this.position.x - (this.image.width/2) && x <= (this.position.x + (this.image.width/2))){
            if(y >= this.position.y - (this.image.height/2) && y <= (this.position.y + (this.image.height/2))){
                return true;
            }
        }
        return false;
    }
});