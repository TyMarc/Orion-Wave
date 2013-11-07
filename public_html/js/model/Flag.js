Flag = Base.extend({
	constructor : function(initialTarget, finalTarget, flagState){	
		this.initialTarget = initialTarget;
		this.finalTarget = finalTarget;
		
		if(flagState === undefined){
			this.flagState = FlagState.STANDBY;
		}
		else{
			this.flagState = flagState;
		}
	}
});
