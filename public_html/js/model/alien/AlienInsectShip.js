var AlienInsectShip = AttackShip.extend({
    constructor : function(id, playerId, position) {
        var imageSrc = "images/Aliens/alien_ship0.png";
        var bulletImageSrc = "images/Aliens/alien_bullet0.png";
        this.base(id, playerId, position, 300, 0, imageSrc, bulletImageSrc, 100, 25, 500, 75);

    },

    update : function(framerate) {
        this.base(framerate);
    },

    draw : function(context, camera) {
        if(camera.isInViewport(this.position, this.image.width, this.image.height)) {
            context.save();

            var relativePosition = camera.calculateRelativePosition(this.position);
            context.translate(relativePosition.x, relativePosition.y);
            context.rotate(this.orientation);
            context.drawImage(this.image, -(this.image.width/2), -(this.image.height/2));
            context.restore();
        }

        for(var b in this.bullets){
            this.bullets[b].draw(context, camera);
        }
    },

    attack : function(enemy, framerate) {
        this.base(enemy, framerate);
    }
});
