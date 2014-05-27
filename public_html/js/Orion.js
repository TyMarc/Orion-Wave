include("js/model/FlagState.js");
include("js/model/Resources.js");
include("js/model/ResourcePod.js");
include("js/model/Flag.js");
include("js/model/PlayerObject.js");
include("js/model/Unit.js");
include("js/model/Builder.js");
include("js/model/Cargo.js");
include("js/model/Building.js");
include("js/model/Bullet.js");
include("js/model/AttackShip.js");
include("js/model/human/BasicAttackShip.js");
include("js/model/Extractor.js");
include("js/model/MotherShip.js");
include("js/model/Player.js");
include("js/view/OrionView.js");
include("js/model/world/Nebula.js");
include("js/model/world/Asteroid.js");
include("js/model/world/Planet.js");
include("js/model/world/SolarSystem.js");
include("js/model/world/OrionWorld.js");
include("js/model/OrionGame.js");
include("js/OrionSocket.js");

include("js/model/alien/AlienAi.js");
include("js/model/alien/AlienInsect.js");


Orion = FilthyEngine.extend({
	constructor : function(containerId, fullscreen, alwaysRefresh/*canvasId, cameraWidth, cameraHeight, worldWight, worldHeight*/) {
		this.base(containerId, fullscreen, alwaysRefresh);
		this.game;
		//this.view = new OrionView(this.game, canvasId);

        this.createSocket('main', new OrionSocket(this, 'http://lmainformatique.ca', '8080'));
	},

	init : function() {
		this.base();
		var ref = this;
		this.addView('LOGIN',
            new View("partials/login.htm", 'page_login', function() {
                ref.getSocket('main').listenTo('auth', function(data) {
                    ref.getSocket('main').username = data['username'];
                    ref.changeView('LOBBIES');
                });
                $('#page_login #login_button').live('click', function(event) {
                    if($('#login_username').val() != '') {
                        ref.getSocket('main').emit('auth', '', {username:$('#login_username').val()});
                    } else {
                        $('#login_username').addClass('error');
                    }
                });
                ref.changeView('LOGIN');
            })
        );
        this.getView('LOGIN').init = function() { $('#page_login #login_username').focus(); };
        this.addView('LOBBIES',
            new View("partials/lobbies.htm", 'page_lobbies', function() {
                $('#page_lobbies #create-lobby').live('click', function(event) {
                    ref.changeView('CREATE-LOBBY');
                });

                $('#page_lobbies #refresh-lobbies').live('click', function(event) {
                    ref.getSocket('main').emit('get-lobbies');
                });

                $('#page_lobbies #join-lobby').live('click', function(event){
                    var lobby = $('#page_lobbies .lobby.selected');
                    if(lobby.length > 0) {
                        ref.getSocket('main').emit('join-lobby', '', {lobby_id:$(lobby).attr('lobby_id')});
                    }
                });

                ref.getSocket('main').listenTo('lobby-joined', function(data) {
                    ref.getSocket('main').currentLobby = data['lobby_id'];
                    ref.changeView('LOBBY');
                });

                $('#page_lobbies .lobbylist .lobby').live('click', function(event) {
                    $('#page_lobbies .lobby').each(function() {
                        if($(this).hasClass('selected')) {
                            $(this).removeClass('selected');
                        }
                    });
                    $(this).addClass('selected');
                });
            })
        );
        this.getView('LOBBIES').init = function() {
            $('#page_lobbies .title').html(ref.getSocket('main').username);
            ref.getSocket('main').listenTo('get-lobbies', function(data) {
                $('#page_lobbies .lobby').each(function() {
                    if(!$(this).hasClass('prototype')) {
                       $(this).remove();
                    }
                });

                for(i in data['lobbies']) {
                    var lobby = data['lobbies'][i];
                    var row = $('#page_lobbies .lobby.prototype').clone();
                    $(row).attr('lobby_id', lobby['id']);
                    $(row).find('.game_name').html(lobby['name']);
                    $(row).find('.nPlayers').html(lobby['nPlayers']+'/'+lobby['maxPlayers']);
                    $(row).removeClass('prototype');

                    $('#page_lobbies .lobbylist').append($(row));
                }

            });
            ref.getSocket('main').emit('get-lobbies');

            $('#page_lobbies .lobbylist').slimscroll({
                height: 'auto',
                color: '#fff',
                distance : '5px'
            });

        };

        this.addView('CREATE-LOBBY',
            new View('partials/create-lobby.htm', 'page_create_lobby', function() {
                ref.getSocket('main').listenTo('lobby-created', function(data) {
                    if(data['lobby'] != undefined) {
                        ref.getSocket('main').emit('join-lobby', '', {lobby_id:data['lobby']});
                    }
                });

                ref.getSocket('main').listenTo('lobby-back', function(data) {
                    ref.changeView('LOBBIES');
                });

                 $('#page_create_lobby #create_lobby_button').live('click', function(event) {
                      ref.getSocket('main').emit('create-lobby', '', {game_name:$('#page_create_lobby #game_name').val(), maxPlayers:2});
                 });

                $('#page_create_lobby #create_lobby_back_button').live('click', function(event) {
                    ref.getSocket('main').emit('lobby-back', '', {});
                });
            })
        );
        this.getView('CREATE-LOBBY').init = function() { $('#page_create_lobby #game_name').focus(); };
        this.addView('LOBBY',
            new View('partials/lobby.htm', 'page_lobby', function() {
                var refreshPlayers = function(lobby) {
                    $('#page_lobby .player').each(function() {
                        if(!$(this).hasClass('prototype')) {
                            $(this).remove();
                        }
                    });
                    for(var i in lobby['clients']) {
                        var client = lobby['clients'][i];
                        var row = $('#page_lobby .player.prototype').clone();
                        $(row).attr('player_id', client['id']);
                        $(row).find('.name').html(client['name']);
                        if(client['isOwner']) {
                            $(row).find('.status').addClass('owner');
                            if(client['id'] == ref.getSocket('main').myUID) {
                                $('.lobby_action_button').html("Start Game");
                                ref.getSocket('main').isOwner = true;
                            }
                            else {
                                $('.lobby_action_button').html("Ready");
                                ref.getSocket('main').isOwner = false;
                            }
                        }
                        $(row).removeClass('prototype');
                        $('#page_lobby .players').append($(row));
                    }
                }
                ref.getSocket('main').listenTo('lobby-refresh', function(data) {
                    refreshPlayers(data['lobby']);
                });

                ref.getSocket('main').listenTo('disconnect-lobby', function(data) {
                    ref.changeView("LOBBIES");
                });

                ref.getSocket('main').listenTo('lobby-ready', function(data) {
                    $('#page_lobby .player').each(function() {
                        if($(this).attr('player_id') == data['readyId']) {
                           $(this).find('.status').addClass('ready');
                        }
                    });
                });

                $('#page_lobby .lobby_action_button').live('click', function(event) {
                    if(ref.getSocket('main').isOwner) {
                        ref.getSocket('main').emit('start-game', '', {lobby_id:ref.getSocket('main').currentLobby});
                    } else {
                        ref.getSocket('main').emit('lobby-ready', '', {lobby_id:ref.getSocket('main').currentLobby});
                    }
                });


                $('#page_lobby .lobby_cancel_button').live('click', function(event) {
                    ref.getSocket('main').emit('disconnect-lobby', '', {lobby_id:ref.getSocket('main').currentLobby});
                })
                ;
                ref.getSocket('main').listenTo('game-started', function(data) {
                    ref.game = new OrionGame(window.innerWidth, window.innerHeight, data['game'], ref.getSocket('main').myUID);
                    ref.getView('GAME').game = ref.game;
                    ref.changeView('GAME');
                });
            })
        );

        this.getView('LOBBY').init = function() {
            ref.getSocket('main').listenTo('get-lobby', function(data) {
                var lobby = data['lobby'];
                $('#page_lobby .title').html(lobby['name']);

                $('#page_lobby .player').each(function() {
                    if(!$(this).hasClass('prototype')) {
                        $(this).remove();
                    }
                });

                for(var i in lobby['clients']) {
                    var client = lobby['clients'][i];
                    var row = $('#page_lobby .player.prototype').clone();
                    $(row).attr('player_id', client['id']);
                    $(row).find('.name').html(client['name']);
                    if(client['isOwner']) {
                        $(row).find('.status').addClass('owner');
                        if(client['id'] == ref.getSocket('main').myUID)
                            $('.lobby_action_button').html("Start Game");
                        else
                            $('.lobby_action_button').html("Ready");
                    }
                    $(row).removeClass('prototype');

                    $('#page_lobby .players').append($(row));
                }
            });

            ref.getSocket('main').emit('get-lobby', '', {lobby_id:ref.getSocket('main').currentLobby});
        };


        this.addView('GAME',
            new OrionView('partials/game.htm', 'game_canvas', function() {

                ref.getSocket('main').listenTo('gameMessage',  function(data) {
                    if(data['type'] == 'move') {
                        var unitsToMove = new Array();
                        for(var unitId in data['unitIds']){
                            unitsToMove[unitId] = ref.game.players[''+data['uid']].units[''+data['unitIds'][unitId]]
                        }
                        ref.game.makeFormation(unitsToMove, new Point(data['x'], data['y']), FlagState.MOVE);
                    } else if(data['type'] == 'attack') {
                        var unitsAttack = new Array();
                        console.log(ref.game);
                        var unitToAttack;
                        if(data['isSpawner'] == 1){
                            unitToAttack = ref.game.aliens[data['alienToAttackId']+''].spawner;
                        }
                        else{
                            unitToAttack = ref.game.aliens[data['alienToAttackId']+''].units[data['unitToAttackId']+''];
                        }
                        for(var unitId in data['unitIds']){
                            unitsAttack[unitId] = ref.game.players[''+data['uid']].units[''+data['unitIds'][unitId]]
                            unitsAttack[unitId].changeFlag(unitToAttack, FlagState.ATTACK);
                        }

                    } else if(data['type'] == 'disconnect') {
                        delete ref.game.players[""+data['uid']];
                    } else if(data['type'] == 'destroy-alien') {
                        if(data['isSpawner'] == 1){
                            delete ref.game.aliens[''+data['alienToKillId']];
                        }
                        else{
                            delete ref.game.aliens[''+data['alienToKillId']].units[''+data['unitToKillId']];
                        }
                    } else if(data['type'] == 'destroy-unit') {
                        delete ref.game.players[''+data['uid']].units[''+data['id']];
                        delete ref.game.selectedUnits[''+data['id']];
                    } else if(data['type'] == 'destroy-player'){
                        delete ref.game.players[''+data['uid']];
                        if(data['uid'] == ref.game.playerId)
                            delete ref.game.selectedUnits;
                    }
                    else if(data['type'] == 'create-attack') {
                        ref.game.players[''+data['uid']].buy(UnitCost.ATTACK);
                        ref.game.players[''+data['uid']].units[''+data['id']] = new BasicAttackShip(data['id'], data['uid'], new Point(data['x'], data['y']), data['color']);
                       // ref.game.selectedIndex = data['id'];
                    } else if(data['type'] == 'create-cargo') {
                        ref.game.players[''+data['uid']].buy(UnitCost.CARGO);
                        ref.game.players[''+data['uid']].units[''+data['id']] = new Cargo(data['id'], data['uid'], new Point(data['x'], data['y']), data['color']);
                        //ref.game.selectedIndex = data['id'];
                    } else if(data['type'] == 'create-builder') {
                        ref.game.players[''+data['uid']].buy(UnitCost.BUILDER);
                        ref.game.players[''+data['uid']].units[''+data['id']] = new Builder(data['id'], data['uid'], new Point(data['x'], data['y']), data['color']);
                        //ref.game.selectedIndex = data['id'];
                    } else if(data['type'] == 'build-extractor') {
                        ref.game.players[''+data['uid']].buy(BuildingCost.EXTRACTOR);
                        var extractor = new Extractor(data['id'], new Point(data['x'], data['y']), data['color'], ref.game.world.solarSystems[data['selectedSolarSystem']].planets[data['selectedPlanet']]);
                        ref.game.players[''+data['uid']].buildings[''+data['id']] = extractor;
                        ref.game.selectedIndex = data['id'];
                        ref.game.players[''+data['uid']].units[''+data['selectedBuilder']].changeFlag(extractor, FlagState.BUILD);
                    } else if(data['type'] == 'move-mothership') {
                        ref.game.moveMotherShip(data['uid'], data['x'], data['y']);
                    } else if(data['type'] == 'continue-build') {
                        ref.game.players[''+data['uid']].units[''+data['unitId']].changeFlag(ref.game.players[''+data['uid']].buildings[data['buildingId']], FlagState.BUILD);
                    } else if(data['type'] == 'gather-extractor') {
                        ref.game.players[''+data['uid']].units[''+data['cargoId']].changeFlag(ref.game.players[''+data['uid']].buildings[data['extractorId']], FlagState.GATHER);
                    } else if(data['type'] == 'return-gather') {
                        ref.game.players[''+data['uid']].units[''+data['unitId']].changeFlag(ref.game.players[''+data['uid']].mothership, FlagState.GATHER);
                    } else if(data['type'] == 'wait') {
                        ref.game.wait(data['serverFrame'], data['lowestUid']);
                    } else if(data['type'] == 'done-waiting') {
                        ref.game.doneWaiting();
                    } else if(data['type'] == 'next-wave') {
                        ref.game.currentTurn++;
                        ref.game.rotateHourglass = true;
                        for(var s in data['spawners']) {
                            ref.game.aliens[''+data['spawners'][s]['id']] = new AlienInsect(data['spawners'][s]['id'], 1, 10, ref.game, {x:data['spawners'][s]['x'], y:data['spawners'][s]['y']});
                        }
                    }

                });
            })
        );
        this.getView('GAME').init = function() {
            ref.getView('GAME').canvas['game_canvas'] = document.getElementById('game_canvas');
            ref.getView('GAME').context['game_canvas'] = this.canvas['game_canvas'].getContext("2d");

            $(document).bind("keydown", function(event) {
                ref.game.keypress(event.which);
            });
            $(document).bind("keyup", function(event) {
                ref.game.keyrelease(event.which);
            });

            $(document).bind("mousedown", function(event) {
                if(event.button == 0){
                    ref.game.startBoxSelect = new Point(0,0);
                    ref.game.startBoxSelect.x = event.clientX;
                    ref.game.startBoxSelect.y = event.clientY;
                }
            });
            $(document).bind("mousemove", function(event) {
                if(event.button == 0){
                    ref.game.endBoxSelect = new Point(0,0);
                    ref.game.endBoxSelect.x = event.clientX;
                    ref.game.endBoxSelect.y = event.clientY;
                }
            });

            $(document).bind("mouseup", function(event) {
                if(event.button == 0){
                    var startBoxSelect= ref.game.startBoxSelect;
                    if(startBoxSelect != undefined) {
                        var startBoxSelect = ref.game.camera.calculateAbsolutePosition(ref.game.startBoxSelect.x, ref.game.startBoxSelect.y);
                    }
                    var endBoxSelect = startBoxSelect;
                    if(ref.game.endBoxSelect != undefined) {
                        endBoxSelect = ref.game.camera.calculateAbsolutePosition(ref.game.endBoxSelect.x, ref.game.endBoxSelect.y);
                    }

                    if(Utils.calcDistance(startBoxSelect, endBoxSelect) >= 20){
                        ref.game.menu_opened = -1;
                        ref.game.selectedUnits = new Array();
                        for(var u in ref.game.players[ref.game.playerId].units){
                            var unit = ref.game.players[ref.game.playerId].units[u];
                            if(unit.boxSelect(startBoxSelect, endBoxSelect)){
                                ref.game.selectedUnits.push(unit);
                            }
                        }
                    }
                    else {
                        ref.game.selectedUnits = new Array();
                        var position = ref.game.camera.calculateAbsolutePosition(event.clientX, event.clientY);
                        ref.game.clickSelect(position);
                    }
                    ref.game.startBoxSelect = undefined;
                    ref.game.endBoxSelect = undefined;
                }
            });

            $(document).bind("contextmenu", function(event) {
                if(ref.game.selectedIndex != -1) {
                    var position = ref.game.camera.calculateAbsolutePosition(event.clientX, event.clientY);
                    var args = ref.game.rightClick(position);
                    if(args['type'] !== undefined) {
                        ref.getSocket('main').emit("gameMessage", "", args);
                    }
                }
                event.preventDefault();
            });

            $('#page_game .action_button.create_units').live('click', function(event){
                var p = ref.game.players[ref.game.playerId];
                ref.game.menu_opened = 1;
                event.stopPropagation();
            });

            $('#page_game .action_button.create_cargo').live('click', function(event){
                var p = ref.game.players[ref.game.playerId];
                if(p.canAfford(UnitCost.CARGO)){
                    var position = ref.game.camera.calculateAbsolutePosition(event.clientX, event.clientY);
                    ref.getSocket('main').emit("gameMessage", "create-cargo", {x:position.x, y:position.y, color:p.colorId, frame: ref.game.frame});
                }
                event.stopPropagation();
            });

            $('#page_game .action_button.create_builder').live('click', function(event){
                var p = ref.game.players[ref.game.playerId];
                if(p.canAfford(UnitCost.BUILDER)){
                    var position = ref.game.camera.calculateAbsolutePosition(event.clientX, event.clientY);
                    ref.getSocket('main').emit("gameMessage", "create-builder", {x:position.x, y:position.y, color:p.colorId, frame: ref.game.frame});
                }
                event.stopPropagation();
            });

            $('#page_game .action_button.create_attack').live('click', function(event){
                var p = ref.game.players[ref.game.playerId];
                if(p.canAfford(UnitCost.ATTACK)){
                    var position = ref.game.camera.calculateAbsolutePosition(event.clientX, event.clientY);
                    ref.getSocket('main').emit("gameMessage", "create-attack", {x:position.x, y:position.y, color:p.colorId, frame: ref.game.frame});
                }
                event.stopPropagation();
            });

            var color = Utils.getColor(ref.game.players[ref.game.playerId].colorId);
            $('#page_game #color_player').html("You are " + color + ".<br/>Find a sun to start collecting");
            $('#page_game #color_player').css('background-color', color);
            setTimeout(fadeOutColor, 2000);
            function fadeOutColor() {
                $('#page_game #color_player').fadeOut(1000);
            }

            ref.setAlwaysRefresh(true);
        }
	},

    loop : function(framerate) {
        if(this.game != undefined) {
            if(this.game.currentFrame%5000 >= 0 && this.game.currentFrame%5000 < 30) {
                this.getSocket('main').emit("gameMessage", "frameCheck", {currentFrame:this.game.currentFrame});
            }
            this.game.update(framerate);
            this.views['GAME'].draw();
        }
    },

    onResize : function(width, height) {
        this.base(width, height);
        if(this.game != undefined) {
            this.game.resize(window.innerWidth, window.innerHeight);
        }
    }
});
