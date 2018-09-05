var app = require('express')();
var http = require('http').Server(app);
var socketio = require('socket.io')(http);
var port = process.env.PORT || 5000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

socketio.on('connection', function(socket){
  console.log('a user connected');
  socket.on('chatpipe', function(msg){
    console.log('message: ' + msg);
    socketio.emit('chatpipe', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:'+port);
});