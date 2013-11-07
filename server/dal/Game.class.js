var OrionWorld = require("./OrionWorld.class");
var Player = require("./Player.class");
var Point = require("./Point.class");
var Spawner = require("./Spawner");

function Game(clients, lobby) {
    this.lobby = lobby;
    this.world = new OrionWorld(8000, 8000);
    this.players = {};
    this.aliens = [];
    var multiplayer = false;
    if(Object.keys(clients).length > 1) {
        multiplayer = true;
    }
    var color = 0;
    for(var i in clients) {
        var client = clients[i];
        this.players[client.id+""] = new Player(client.id, client.name, color, multiplayer);
        color++;
    }
    this.currentLevel = 0;
    this.frame = 0;
    this.wait = false;
    ref = this;
    setInterval((function() {
        if(!this.wait) {
            ref.frame += 30;

            if(ref.frame % 100000 >= 0 && ref.frame%100000 < 30) {
                 ref.nextLevel();
            }
        }
    }), 30);
}

Game.prototype.nextLevel = function() {
    this.currentLevel++;
    var message = {};
    message['type'] = 'next-wave';
    message['alien-type'] = 0;
    message['spawners'] = [];
    var spawnerWidth = 300;
    var spawnerHeight = 300;
    for(var i=0;i<4;i++) {
        var spawnerX = Math.floor((Math.random()*this.world.width) + spawnerWidth) - this.world.width/2 - spawnerWidth;
        var spawnerY = Math.floor((Math.random()*this.world.height) + spawnerHeight) - this.world.height/2 + spawnerHeight;
        this.aliens.push(new Spawner(new Point(this.aliens.length, spawnerX,spawnerY)));
        message['spawners'].push({id:this.aliens.length, x:spawnerX, y:spawnerY});
    }
    this.lobby.broadcast('gameMessage', message);
}

Game.prototype.toJSON = function() {
    var json = {};

    json['world'] = this.world.toJSON();
    json['players'] = {};
    for(var i in this.players) {
        json['players'][i] = this.players[i].toJSON();
    }     /*
    json['mothershipX'] = this.mothership['x'];
    json['mothershipY'] = this.mothership['y'];     */
    return json;
}

module.exports = Game;