function Utils(){
}

Utils.getAngledPoint = function(angle, longueur, cx, cy){
	var x = (Math.cos(angle)*longueur)+cx;
    var y = (Math.sin(angle)*longueur)+cy;
    
    return new Point(x,y);
}

Utils.calcAngle = function(position1, position2){
	var dx = position2.x-position1.x;
	var dy = position2.y-position1.y;
	var angle = (Math.atan2(dy,dx));
	
	return angle;
}

Utils.calcDistance = function(position1, position2){
	var dx = Math.pow(Math.abs(position2.x-position1.x), 2);
	var dy = Math.pow(Math.abs(position2.y-position1.y), 2);
	var distance = Math.sqrt(dx+dy);
	
	return distance;
}

Utils.calcSlope = function(position1, position2){
	var pente = (position2.y - position1.y)/(position2.x - position1.x);
	
	return pente;
}

Utils.calcIntercept = function(x, y, slope){
	var b = -1*(slope*x - y);
	
	return b;
}

Utils.unitPerSecondToPerFramerate = function(unitPerSecond, framerate) {
	return unitPerSecond * framerate / 1000;
}

Utils.round = function(value) {
    return (0.5 + somenum) << 0;
}

Utils.contains = function(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
};

Utils.getColor = function(colorId){
	switch(colorId){
		case 0:
			return "red";
			break;
		case 1:
			return "blue";
			break;
		case 2:
			return "orange";
			break;
		case 3:
			return "green";
			break;
		case 4:
			return "yellow";
			break;
		case 5:
			return "brown";
			break;
		case 6:
			return "white";
			break;
		case 7:
			return "pink";
			break;
	}
};
