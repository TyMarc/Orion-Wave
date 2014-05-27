include("js/utils/Utils.js");
include("js/Orion.js");

var engine;

var FRAMERATE = 1000/30;
var lastLoop = new Date().getTime();
window.onload = init;

function init() {
	engine = new Orion('engine-container', true, false/*"mainCanvas", window.innerWidth, window.innerHeight, 3000, 2000*/);
	engine.init();
	loop();
}

//newLoop is equal to the timeStamp of this loop call
//lastLoop is equal to the timeStamp of the last loop
//interval is equal to the real framerate (how many millis between both calls) 
function loop() {
	var newLoop = new Date().getTime();
	interval = newLoop - lastLoop;
	engine.loop(interval);
	
	lastLoop = new Date().getTime();
	setTimeout(loop, FRAMERATE);
}

$(window).resize(function() {
	engine.onResize();
});