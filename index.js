var express = require('express')
var app = require('express')();
var server = require('http').Server(app);
var socketio = require('socket.io')(server);
var port = process.env.PORT || 5000;
users = [];
connections = [];

server.listen(port, function(){
  console.log('listening on *:'+port);
});
app.use(express.static('public'));

socketio.on('connection', function(socket){
	connections.push(socket);
	console.log('[INFO] Connection: %s sockets connected.',connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		console.log('[INFO] '+socket.username + ' left out');
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('[INFO] Disconnected: %s sockets connected.', connections.length);

	});
	
	// Send Message
	socket.on('chatpipe', function(msg){
	    console.log('[INFO] message: ' + msg);
	    socketio.emit('newMessage', {user:socket.username, message:msg});
	});

	// New User
	socket.on('newUser', function(username,callback){
		if(users.indexOf(username) > -1){
			console.log("[ERROR] Duplicate Username");
			callback(false);
		}else{
			callback(true);
			console.log('[INFO] '+username + ' joined!');
			socket.username = username;
			users.push(socket.username);
			updateUsernames();
		}
		
	});

	function updateUsernames(){
		socketio.emit('getUsers', users);
	}
});

