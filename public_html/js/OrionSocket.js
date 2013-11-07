var OrionSocket = SocketConnection.extend({
	constructor : function OrionSocket(engine, serverAddress, port) {
		this.base(serverAddress, port);
		this.engine = engine;
		this.username = "Anonymous";
        this.currentLobby = -1;
        this.isOwner = false;
	},
	
	init : function(){
		this.base();
		var R = this;
		//this.socket.emit('create-lobby', {id: this.messageId});
		
		//this.socket.on('lobby-created', function(data) {
			
		
		this.socket.emit("client-connect");
		this.socket.on('handshake', function(data) {
			if(R.myUID === undefined)
				R.myUID = data['uid'];
		});
		/*
		this.socket.on('message', function (data) {
			R.engine.onMessage(data);
		});*/
		//});
	},
	
	createLobby : function(callback) {
		
	},
	
	joinGame : function() {
		
	}
});