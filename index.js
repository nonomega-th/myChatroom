var app = require('express')();
var server = require('http').Server(app);
var socketio = require('socket.io')(server);
var port = process.env.PORT || 5000;
users = [];
connections = [];

server.listen(port, function(){
  console.log('listening on *:'+port);
});
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

socketio.on('connection', function(socket){
	connections.push(socket);
	console.log('Connection: %s sockets connected.',connections.length);

	// Disconnect
	socket.on('disconnect', function(data){
		console.log(socket.username + ' left out');
		users.splice(users.indexOf(socket.username), 1);
		updateUsernames();
		connections.splice(connections.indexOf(socket), 1);
		console.log('Disconnected: %s sockets connected.', connections.length);

	});
	
	// Send Message
	socket.on('chatpipe', function(msg){
	    console.log('message: ' + msg);
	    socketio.emit('newMessage', {user:socket.username, message:msg});
	});

	// New User
	socket.on('newUser', function(username,callback){
		callback(true);
	    console.log(username + ' joined!');
	    socket.username = username;
	    users.push(socket.username);
	    updateUsernames();
	});

	function updateUsernames(){
		socketio.emit('getUsers', users);
	}
});

