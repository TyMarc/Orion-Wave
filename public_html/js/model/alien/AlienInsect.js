include('js/model/alien/AlienInsectSpawner.js');
include('js/model/alien/AlienInsectShip.js');

var AlienInsect = AlienAi.extend({
    constructor : function(id, actionPerSecond, spawnRate, game, spawnerInfo){
        this.base(id, actionPerSecond, spawnRate, game);

        this.spawner = new AlienInsectSpawner(new Point(spawnerInfo['x'], spawnerInfo['y']), spawnRate, id);
    },

    takeDecision : function() {
        this.base();

        this.game.makeFormation(this.units, new Point(this.spawner.position.x, this.spawner.position.y + 500), FlagState.MOVE);

        var pool = [];
        var c = 0;
        for(p in this.game.players) {
            pool.push(this.game.players[p].uid);
            c++;
        }
        var playerIndex = Math.floor(Math.random()*c);
        var playerId = pool[playerIndex];
        for(var i in this.units) {
            if(this.game.players[playerId+''] != undefined){
                this.units[i].changeFlag(this.game.players[playerId+''].mothership, FlagState.ATTACK);
            }
        }
    }
});