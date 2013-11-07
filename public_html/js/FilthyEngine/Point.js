var Point = Base.extend({
	constructor : function(x, y){
		this.x = x;
		this.y = y;
	},

    valueOf : function(point) {
        if(point != undefined){
            if(this.x == point.x && this.y == point.y){
                return true;
            }
        }
        return false;
    }
});