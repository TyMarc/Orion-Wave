var AttackShip = Unit.extend({
	constructor : function(id, playerId, position, color) {
        this.base(id, playerId, position, 300, color);

		this.id = id;
		this.playerId = playerId;
		this.moveSpeed = 150;
		this.orientation = 0;
		this.colorId = color;

        /*To determine*/
        this.damage = 50;
        this.range = 500;
        this.attackSpeed = 50;
        this.bullets = [];

        this.image.src = "images/Attack/attack" + color + ".png"
	},

    draw : function(context, camera, selectedUnits) {
        this.base(context, camera, selectedUnits);
        for(var b in this.bullets){
            this.bullets[b].draw(context, camera);
        }
    },

    update : function(framerate, player) {
        if(this.flag.flagState == FlagState.ATTACK) {
            this.attack(this.flag.finalTarget, framerate);
        }
        else{
            this.base(framerate, player);
        }

        for(var b in this.bullets){
            this.bullets[b].update(framerate);
            if(this.bullets[b].detruit == true){
                this.bullets.splice(b,1);
            }
        }

        if(this.flag.finalTarget.hitpoints <= 0){
            this.changeFlag(this.position, FlagState.STANDBY);
        }
    },

    attack : function(enemy, framerate) {
        if(Utils.calcDistance(new Point(this.position.x, this.position.y), enemy.position) >= this.range) {
            this.move(framerate);
        }
        else{
            this.attackSpeed -= 1;

            if(this.attackSpeed == 0){
                this.bullets.push(new Bullet(new Point(this.position.x, this.position.y), enemy, this.damage, "images/Attack/bullet_mauve.png"));
                this.attackSpeed = 50;
            }
        }
    }
});
