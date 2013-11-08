var BasicAttackShip = AttackShip.extend({
    constructor : function(id, playerId, position, color) {
        var imageSrc = "images/Attack/attack" + color + ".png";
        var bulletImageSrc = "images/Attack/bullet_mauve.png";
        this.base(id, playerId, position, 300, color, imageSrc, bulletImageSrc, 150, 50, 500, 50);
    },

    draw : function(context, camera, selectedUnits) {
        this.base(context, camera, selectedUnits);
    },

    update : function(framerate, player) {
        this.base(framerate, player);
    },

    attack : function(enemy, framerate) {
        this.base(enemy, framerate);
    }
});
