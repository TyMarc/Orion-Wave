var AlienInsectSpawner = AlienSpawner.extend({
    constructor : function(position, spawnRate, alienId) {
        this.base(position, spawnRate, alienId, 200);

        this.image.src = "images/Aliens/alien_base0.png";
    },

    createUnit : function() {
        this.base();
        return new AlienInsectShip(this.spawnCounter, this.alienId, new Point(this.position.x, this.position.y));
    }
});