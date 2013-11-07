/* Game Clients */
function GameClient(socket){
	this.id = ++GameClient.ID_SEQ;
	GameClient._instances[this.id+""] = this;
	this.name = "Anonymous";
	this.socket = socket;
	socket.client = this; //Needed when answering calls after the initial connections
	this.currentLobby = -1;
}
GameClient.get = function(uid){
	return GameClient._instances[uid+""];
}
GameClient.ID_SEQ = Math.floor(9001*Math.random());
GameClient._instances = {};


module.exports = GameClient;