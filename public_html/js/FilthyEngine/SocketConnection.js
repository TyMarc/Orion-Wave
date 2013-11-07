var SocketConnection = Base.extend({
	constructor : function (serverAddress, port) {
		this.myUID;
		this.messageId = 0;
		this.callbacks = {};
		this.serverAddress = serverAddress;
		this.port = port;
		
		this.init();
	},
	
	init : function() {
		this.socket = io.connect(this.serverAddress+':'+this.port);
	},
	
	listenTo : function(eventName, callback) {
		this.socket.on(eventName, callback);
	},
	
	emit : function(message_name, message_type, add_args, callback) {
		this.messageId++;
		var args = $.extend({ id: this.messageId, uid:this.myUID, type: message_type }, add_args); 
		
		if(callback){
			args['callback'] = true;
			this.callbacks[this.messageId+""] = callback;
		}
		
		this.socket.emit(message_name, args);
	},
	
	callback : function(callbackId) {
		if(typeof this.callbacks[callbackId+""] !== 'undefined')
			this.callbacks[callbackId+""]();
	}
});