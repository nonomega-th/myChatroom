$(function () {
  var socket = io.connect();

  var messageFormArea = $('#messageFormArea');
  var messageForm = $('#messageForm');
  var message = $('#messagesinput');
  var chat = $('#chat');

  var userForm = $('#userForm');
  var userFormArea = $('#userFormArea');

  var users = $('#users');
  var username = $('#username');

  message.keypress(function (event) {
    if(event.which == 13 && !event.shiftKey) {        
      messageForm.submit();
      event.preventDefault();
      return false;
    }
  });
  messageForm.submit(function(event){
    var messagestemp = message.val()
    if ($.trim(messagestemp) != '') {
      socket.emit('chatpipe', messagestemp);
    }
    $('#messagesinput').val('');
    event.preventDefault();
  });
  socket.on('newMessage', function(payload){
      chat.append('<div class="well"><strong>' +payload.user+ ': </strong>' + payload.message + '</div>');
  });

  userForm.submit(function(event){
    event.preventDefault();
    var usernametemp = username.val()
    if ($.trim(usernametemp) != '') {
      socket.emit('newUser', usernametemp, function(data){
        if(data){
          userFormArea.hide();
          messageFormArea.show();
        }
      });
      username.val('');
    }
    $('#messagesinput').val('');
  });

  socket.on('getUsers', function(userlist){
    var html = '';
    for(i=0; i<userlist.length; i++){
      html += '<div class="list-group-item" style="margin-top: 5px">' + userlist[i] + '</div>';
    } 
    users.html(html);
  });
});
