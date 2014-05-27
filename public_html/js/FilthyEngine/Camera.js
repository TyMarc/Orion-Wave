var Camera = Base.extend({
	constructor :function(width, height) {
		this.width =  width;
		this.height = height;
		this.halfWidth = width/2;
		this.halfHeight = height/2;
		//this.position = new Point(this.halfWidth, this.halfHeight);
        this.position = new Point(0, 0);
		this.speed = 12;
		this.target = new Target(new Point(this.position.x, this.position.y));
	},
	
	resize : function(width, height, world) {
		this.width =  width;
		this.height = height;
		this.halfWidth = width/2;
		this.halfHeight = height/2;
		if(this.position.x <= this.halfWidth) {
			this.position.x = this.halfWidth;
		}
		else if(this.position.x >= world.width-(this.halfWidth)) {
			this.position.x = world.width-(this.halfWidth);
		}
		if(this.position.y <= this.halfHeight) {
			this.position.y = this.halfHeight;
		}
		else if(this.position.y >= world.height-(this.halfHeight)) {
			this.position.y = world.height-(this.halfHeight);
		}
	},
	
	update : function(world) {
		if(Math.abs(this.target.position.x - this.position.x) < this.speed) {
			this.position.x = this.target.position.x;
		}
		else {
			if(this.target.position.x > this.position.x) {
				this.position.x += this.speed;
			}
			else if(this.target.position.x < this.position.x) {
				this.position.x -= this.speed;
			}
		}
		if(Math.abs(this.target.position.y - this.position.y) < this.speed) {
			this.position.y = this.target.position.y;
		}
		else {
			if(this.target.position.y > this.position.y) {
				this.position.y += this.speed;
			}
			else if(this.target.position.y < this.position.y) {
				this.position.y -= this.speed;
			}
		}
		if(this.position.x > world.width/2 - this.halfWidth) {
			this.position.x = world.width/2 - this.halfWidth
		}
		else if(this.position.x < this.halfWidth - world.width/2) {
			this.position.x = this.halfWidth - world.width/2;
		}
		if(this.position.y > world.height/2 - this.halfHeight) {
			this.position.y = world.height/2- this.halfHeight
		}
		else if(this.position.y < this.halfHeight - world.height/2) {
			this.position.y = this.halfHeight - world.height/2;
		}
	},

	resetTargetX : function() {
		this.target.position.x = this.position.x;
	},
	
	resetTargetY : function() {
		this.target.position.y = this.position.y;
	},
	
	isInViewport : function(position, width, height) {
		if(position.x + width/2 > this.position.x - this.halfWidth && position.x - width/2 < this.position.x + this.halfWidth)
		{
			if(position.y + height/2 > this.position.y - this.halfHeight && position.y - height/2 < this.position.y + this.halfHeight)
			{
				return true;
			}
		}
		return false;
	},
	
	calculateRelativePosition : function(position) {
		return new Point(position.x - (this.position.x-this.halfWidth), position.y - (this.position.y - this.halfHeight));
	},
	
	calculateAbsolutePosition : function(x, y) {
		return new Point(x + (this.position.x-this.halfWidth), y + (this.position.y - this.halfHeight));
	}
});