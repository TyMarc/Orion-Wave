var AlienInsectShip = AttackShip.extend({
    constructor : function(id, playerId, position) {
        this.base(id, playerId, position, 0);

        /*To determine*/
        this.hitpoints = 50;
        this.damage = 25;
        this.range = 500;
        this.attackSpeed = 75;

        this.image.src = "images/Aliens/alien_ship0.png";
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
        if(Utils.calcDistance(new Point(this.position.x, this.position.y), enemy.position) >= this.range) {
            this.move(framerate);
        }
        else{
            this.attackSpeed -= 1;

            if(this.attackSpeed == 0){
                this.bullets.push(new Bullet(new Point(this.position.x, this.position.y), enemy, this.damage, "images/Aliens/alien_bullet0.png"));
                this.attackSpeed = 50;
            }
        }
    }
});
