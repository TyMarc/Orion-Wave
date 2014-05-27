var Target = Base.extend({
	constructor : function (position){
		if(position === undefined){
			this.position = new Point(0,0);
		}
		else{
			this.position = position;
		}
	}
});
