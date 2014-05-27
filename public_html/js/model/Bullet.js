Bullet = Target.extend({
    constructor : function(position, enemy, damage, imageUrl) {
        this.base(position);
        this.bulletSpeed = 1500;
        this.orientation = 0;
        this.maxDistance = 10000;
        this.distanceDone = 0;
        this.damage = damage;
        this.detruit = false;
        this.flag = new Flag(new Target(new Point(position.x, position.y)), enemy, FlagState.ATTACK);

        this.image = new Image();
        this.image.src = imageUrl.src;
    },

    changeFlag : function(finalTarget, state) {
        this.flag = new Flag(new Target([this.position.x, this.position.y]), finalTarget, state);
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
    },

    update : function(framerate) {
        if(this.flag.flagState == FlagState.ATTACK){
            this.attack(this.flag.finalTarget, framerate);
        }
    },

    attack : function(enemy, framerate) {
        if(Utils.calcDistance(new Point(this.position.x, this.position.y), enemy.position) >= 50) {
            this.move(framerate);
        }
        else{
            enemy.hitpoints -= this.damage;
            this.detruit = true;
        }
    },

    move : function(framerate) {
        var newMoveSpeed = Utils.unitPerSecondToPerFramerate(this.bulletSpeed, framerate);

        /*
         Si la distance entre la position courante et la position de la cible finale est plus petite
         que la vitesse de déplacement, on ne fait que mettre la position à la cible finale
         */
        if(Utils.calcDistance(this.position, this.flag.finalTarget.position) <= newMoveSpeed) {
            this.position = new Point(this.flag.finalTarget.position.x, this.flag.finalTarget.position.y);
            this.flag.flagState = FlagState.STANDBY;
        }
        else if(this.distanceDone >= this.maxDistance){
            this.detruit = true;
        }
        else {
            var angle = Utils.calcAngle(this.position, this.flag.finalTarget.position);
            var temp = Utils.getAngledPoint(angle, newMoveSpeed, this.position.x, this.position.y);
            this.orientation = angle + (Math.PI/2);
            this.position.x = temp.x;
            this.position.y = temp.y;
        }
    }
});
