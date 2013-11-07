PlayerObject = Target.extend({
	constructor : function(position, hitpoints) {
		this.base(position);
		this.flag = new Flag(new Target(new Point(0,0)), new Target(new Point(0,0)), FlagState.STANDBY);
		this.hitpoints = hitpoints;
        this.maxHitpoints = hitpoints;
	},
	
	changeFlag : function(finalTarget, state) {
		this.flag = new Flag(new Target([this.position.x, this.position.y]), finalTarget, state);
	}
});