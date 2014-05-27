var OrionGame = Game.extend({
	constructor : function(cameraWidth, cameraHeight, data, playerId) {
		this.base(cameraWidth, cameraHeight, new OrionWorld(data['world']));
		this.players = {};
        for(var i in data['players']) {
            var player = data['players'][i];
            this.players[player['id']+""] = new Player(player['id'], player['name'], player['color'], player['mothership']);
        };
		this.selectedUnits = new Array();
		this.playerId = playerId;
		this.startBoxSelect;
		this.endBoxSelect;

        this.hourglass = new Image();
        this.hourglass.src = "images/hourglass.png";
        this.rotateHourglass = true;
        this.hourglassAngle = 0;
        this.gameTimeMs = 0;
        this.currentTurn = 1;
        this.menu_opened = -1;
        this.aliens = {};
	},
	
	draw : function(context) {
		this.base(context);

        for(a in this.aliens) {
            context.save();
            this.aliens[a].draw(context, this.camera);
            context.restore();
        }

		for(var p in this.players){
            if(this.players[p].uid != this.playerId) {
                context.save();
                this.players[p].draw(context, this.camera, this.selectedUnits);
                context.restore();
            }
		}

        if(this.players[this.playerId] != undefined){
            context.save();
            this.players[this.playerId].draw(context, this.camera, this.selectedUnits);
            context.restore();

            if(this.startBoxSelect !== undefined && this.endBoxSelect !== undefined){
                context.beginPath();
                context.rect(this.startBoxSelect.x, this.startBoxSelect.y, this.endBoxSelect.x-this.startBoxSelect.x, this.endBoxSelect.y-this.startBoxSelect.y);
                context.fillStyle = "rgba(255, 255, 255, 0.1)";
                context.fill();
                context.lineWidth = 0.5;
                context.strokeStyle = Utils.getColor(this.players[this.playerId+""].colorId);
                context.stroke();
            }

            this.drawMenu(context);
        }
        else{
            this.eraseMenu();
        }

        this.drawUI(context);
	},

    drawUI : function(context) {
        context.beginPath();
        context.rect(0, 0, this.camera.width, 75);
        context.fillStyle = "rgba(0, 0, 0, 0.8";
        context.fill();
        context.lineWidth = 0.5;
        context.strokeStyle = 'black';
        context.stroke();

        if(this.rotateHourglass){
            (this.hourglassAngle += 5);
        }

        context.save();
        context.translate(this.camera.width-20, 38);
        context.rotate(Math.PI / 180 * this.hourglassAngle);
        context.drawImage(this.hourglass, -20, -32);
        context.restore();

        if(this.hourglassAngle % 180 == 0){
            this.rotateHourglass = false;
        }

        context.font="16px Lucida Console";
        var y = 25;
        for(var p in this.players) {
            if(this.players[p].colorId == 0)
                context.fillStyle = "rgba(255, 0, 0, 1)";
            else
                context.fillStyle = "rgba(0, 100, 255, 1)";

            var pad = "000000";
            var hydrogen = "" + pad.substring(0, pad.length - this.players[p].resources.hydrogen.toString().length) + this.players[p].resources.hydrogen;
            var energy = "" + pad.substring(0, pad.length - this.players[p].resources.energy.toString().length) + this.players[p].resources.energy;
            context.fillText(this.players[p].name + " : Hydrogen : " + hydrogen + " Energy : " + energy ,10,y );
            y+=25;
        }

        context.fillStyle = "rgba(255, 255, 255, 1)"
        tmp = this.gameTimeMs;
        var mins = Math.floor(this.gameTimeMs/1000/60);
        if(mins < 10){
            mins = "0" + mins;
        }
        tmp -= mins*60*1000;
        var secs = Math.floor(tmp/1000);
        if(secs < 10){
            secs = "0" + secs;
        }

        context.fillText('Time' + " : " + mins + ":" + secs, this.camera.width-195, 25);
        context.fillText('Turn' + " : " + this.currentTurn, this.camera.width-175, 50);
    },

    drawMenu : function(context) {
        var mothership = this.players[this.playerId].mothership;
        var relativePosition = this.camera.calculateRelativePosition(mothership.position);
        $('#page_game .action_button').each(function( index ) {
            var top = $(this).offset().top;

            $(this).css('top', '-999999999px');
            $(this).css('left', '-99999999px');

            if(top <= 75){
                $(this).css('opacity', '0.3');
            }
            else{
                $(this).css('opacity', '1');
            }
        });
        if(this.menu_opened == 0){
            /** Bouton units **/
            var button = $('#page_game .action_button.create_units');
            $(button).css('top', (relativePosition.y - mothership.image.height/3)+'px');
            $(button).css('left', ((relativePosition.x-32)-100) +'px');

            /** Bouton tech **/
            button = $('#page_game .action_button.tech');
            $(button).css('top', (relativePosition.y - mothership.image.height/3)+'px');
            $(button).css('left', ((relativePosition.x-32)+100) +'px');
        } else if(this.menu_opened == 1){
            /** Bouton cargo **/
            var button = $('#page_game .action_button.create_cargo');
            $(button).css('top', (relativePosition.y - mothership.image.height/3)+'px');
            $(button).css('left', ((relativePosition.x-32)-100) +'px');

            /** Bouton builder **/
            button = $('#page_game .action_button.create_builder');
            $(button).css('top', (relativePosition.y - mothership.image.height/3)+'px');
            $(button).css('left', ((relativePosition.x-32)) +'px');

            /** Bouton attack **/
            button = $('#page_game .action_button.create_attack');
            $(button).css('top', (relativePosition.y - mothership.image.height/3)+'px');
            $(button).css('left', ((relativePosition.x-32)+100) +'px');
        }
    },

    eraseMenu : function() {
        $('#page_game .action_button').each(function( index ) {
            var top = $(this).offset().top;

            $(this).css('top', '-999999999px');
            $(this).css('left', '-99999999px');

            if(top <= 75){
                $(this).css('opacity', '0.3');
            }
            else{
                $(this).css('opacity', '1');
            }
        });
    },

	update : function(framerate) {
		this.base(framerate);


        if(!this.wait || (this.wait && this.playerId == this.lowestUid)) {
            for(a in this.aliens) {
                if(this.aliens[a].spawner.hitpoints <= 0){
                    delete this.aliens[a];
                }
                else{
                    this.aliens[a].update(framerate);
                }
            }

            for(var p in this.players){
                if(this.players[p].mothership.hitpoints <= 0){
                    if(this.players[p].uid == this.playerId){
                        this.changeBindingsObserver();
                    }
                    delete this.players[p];
                }
                else{
                    this.players[p].update(framerate, this.world, this.selectedUnits);
                }
            }

            this.gameTimeMs += framerate;
        }
	},

    changeBindingsObserver : function() {
        $(document).unbind('mousedown');
        $(document).unbind('mousemove');
        $(document).unbind('mouseup');
        $(document).unbind('contextmenu');
        $(document).bind('contextmenu', function(){event.preventDefault();});
    },
	
	keypress : function(key) {
		this.base(key);
		//droite
		if(key == 39) {
			
			this.camera.target.position.x = this.world.width/2 - this.camera.halfWidth;
		}
		//haut
		else if(key == 38) {
			this.camera.target.position.y = this.camera.halfHeight - this.world.height/2;
		}
		//gauche
		else if(key == 37) {
			this.camera.target.position.x = this.camera.halfWidth - this.world.width/2;
		}
		//bas
		else if(key == 40) {
			this.camera.target.position.y = this.world.height/2 - this.camera.halfHeight;
		}
	},

    resize : function(width, height) {
        this.camera.resize(width, height, this.world);
    },
	
	keyrelease : function(key) {
		this.base(key);
		//droite
		if(key == 39) {
			this.camera.resetTargetX();
		}
		//haut
		else if(key == 38) {
			this.camera.resetTargetY();
		}
		//gauche
		else if(key == 37) {
			this.camera.resetTargetX();
		}
		//bas
		else if(key == 40) {
			this.camera.resetTargetY();
		}
	},

    clickSelect : function(position) {
        this.menu_opened = -1;


        this.selectedUnits = new Array();
        var selection = this.players[this.playerId].clickSelect(position);
        if(selection != null && selection != undefined && selection.length > 0){
            this.selectedUnits = selection;
            if(selection[0] instanceof MotherShip){
                this.menu_opened = 0;
            }
        }
    },

    rightClick : function(position) {
        var message = {};
        message['x'] = position.x;
        message['y'] = position.y;

        if(this.selectedUnits.length == 1) {
            if(this.selectedUnits[0] instanceof MotherShip) {
                message['type'] = 'move-mothership';
            }
            else if(this.selectedUnits[0] instanceof AttackShip){
                var unitToAttack = this.enemySelect(position);
                if(unitToAttack != undefined) {
                    message['type'] = 'attack';
                    message['isSpawner'] = 0;
                    if(unitToAttack instanceof AlienSpawner){
                        message['isSpawner'] = 1;
                        message['alienToAttackId'] = unitToAttack.alienId;
                    }
                    else{
                        message['unitToAttackId'] = unitToAttack.id;
                        message['alienToAttackId'] = unitToAttack.playerId;
                    }
                    var unitIds = new Array();
                    unitIds.push(this.selectedUnits[0].id);
                    message['unitIds'] = unitIds;
                }
            }
            else if(this.selectedUnits[0] instanceof Unit) {
                var selection = this.players[this.playerId].clickSelect(position);
                if(selection !== undefined) {
                    if(this.selectedUnits[0] instanceof Builder) {
                        var selectionElementWorld = this.world.clickSelect(position);
                        if(this.players[this.playerId].selectBuilding(position) instanceof Extractor) {
                            if(this.players[this.playerId].selectBuilding(position).buildingTimer < this.players[this.playerId].selectBuilding(position).buildTime) {

                                message['type'] = 'continue-build';
                                message['buildingId'] = this.players[this.playerId].selectBuilding(position).id;
                                message['unitId'] = this.selectedUnits[0].id;
                            }
                        }
                        else if(selectionElementWorld instanceof Planet) {
                            var build = true;
                            for(var p in this.players){
                                var buildings = this.players[p].buildings;
                                for(var b in buildings){
                                    if(buildings[b] instanceof Extractor){
                                        if(buildings[b].position.valueOf(selectionElementWorld.position)){
                                            build = false;
                                        }
                                    }
                                }
                            }
                            if(build == true){
                                if(this.players[this.playerId].canAfford(BuildingCost.EXTRACTOR)) {
                                    message['type'] = 'build-extractor';
                                    message['x'] = selectionElementWorld.position.x;
                                    message['y'] = selectionElementWorld.position.y;
                                    message['color'] = this.players[this.playerId].colorId;
                                    message['selectedBuilder'] = this.selectedUnits[0].id;
                                    message['selectedPlanet'] = selectionElementWorld.id;
                                    message['selectedSolarSystem'] = selectionElementWorld.solarSystemId;
                                }
                            }
                        }
                    }
                    else if(this.players[this.playerId].selectBuilding(position) instanceof Extractor) {
                        if(this.selectedUnits[0] instanceof Cargo) {
                            message['type'] = 'gather-extractor';
                            message['cargoId'] = this.selectedUnits[0].id;
                            message['extractorId'] = selection[0].id;
                        }
                    }
                    else if(selection[0] instanceof MotherShip) {
                        if(this.selectedUnits[0] instanceof Cargo) {
                            message['type'] = 'return-gather';
                            message['unitId'] = this.selectedUnits[0].id;
                        }
                    }
                }
            }
        } else if(this.selectedUnits.length > 0){
            if(this.selectedUnits[0] instanceof AttackShip){
                var unitToAttack = this.enemySelect(position);
                if(unitToAttack != undefined) {
                    message['type'] = 'attack';
                    message['isSpawner'] = 0;
                    if(unitToAttack instanceof AlienSpawner){
                        message['isSpawner'] = 1;
                        message['alienToAttackId'] = unitToAttack.alienId;
                    }
                    else{
                        message['unitToAttackId'] = unitToAttack.id;
                        message['alienToAttackId'] = unitToAttack.playerId;
                    }

                    var unitIds = new Array();
                    for(var u in this.selectedUnits){
                        if(this.selectedUnits[u] instanceof AttackShip) {
                            unitIds.push(this.selectedUnits[u].id);
                        }
                    }
                    message['unitIds'] = unitIds;
                }
            }

            message['unitIds'] = unitIds;

        }
        if(message['type'] === undefined){
            if(this.selectedUnits[0] instanceof PlayerObject)
            message['type'] = 'move';
            var unitIds = new Array();
            for(var u in this.selectedUnits){
                unitIds.push(this.selectedUnits[u].id);
            }

            message['unitIds'] = unitIds;
        }




        return message;
    },

    enemySelect : function(position) {
        for(var p in this.aliens) {
            var alien = this.aliens[p];
            var select = alien.select(position);
            if(select != undefined){
                return select;
            }
        }

        return undefined;
    },

    moveMotherShip : function(playerId, x, y) {
        this.players[playerId].mothership.changeFlag(new Target(new Point(x,y)), FlagState.MOVE);
    },

	makeFormation : function(units, targetPoint, flagState) {
		if(units.length > 0 && units[0] != undefined)
		{
			var rows = Math.ceil(Math.sqrt(units.length));
			var columns = rows;
			var unitWidth = units[0].image.width/2;
			var unitHeight = units[0].image.height/2;
			var horizontalGap = unitWidth;
			var verticalGap = unitHeight;
			var currentColumn = 0;
			var currentRow = 0;
			
			var middle = rows/2;
			var middle = columns/2;
			var blockWidth = unitWidth + horizontalGap;
			var blockHeight = unitHeight + verticalGap;
			var startY = targetPoint.y - middle * (blockHeight) + (blockHeight)/2;
			var startX = targetPoint.x - middle * (blockWidth) + (blockWidth)/2;

			for(i in units) {
                if(currentColumn == columns) {
                    currentColumn = 0;
                    currentRow ++;
                }
                var x = startX + (blockWidth * currentColumn);
                var y = startY + (blockHeight * currentRow);
                units[i].changeFlag(new Target(new Point(x,y)), flagState)
                currentColumn++;
			}
		}
	}
});
