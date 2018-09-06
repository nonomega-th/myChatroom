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
  var me;

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
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
    if (payload.user == me) {
      chat.append(genmybubble(payload));
    }else{
      chat.append(genyourbubble(payload));
    }
    // chat.append('<p class="bubble you"><strong>' +payload.user+ ': </strong>' + payload.message + '</p>');
  });

  userForm.submit(function(event){
    event.preventDefault();
    var usernametemp = username.val()
    if ($.trim(usernametemp) != '') {
      socket.emit('newUser', usernametemp, function(data){
        if(data){
          me = usernametemp;
          userFormArea.hide();
          messageFormArea.show();
          messagesinput.focus();
        }
      });
      username.val('');
    }
    $('#username').val('');
  });

  socket.on('getUsers', function(userlist){
    var html = '';
    for(i=0; i<userlist.length; i++){
      html += '<div class="list-group-item" style="margin-top:5px">' + userlist[i] + '</div>';
    } 
    users.html(html);
  });
});
function genmybubble(payload){
  return '<li class="bubble me">'+ payload.message + '</li>';
}
function genyourbubble(payload){
  return '<li class="yourusername"><strong>' +payload.user+ '</strong></li><li class="bubble you">' + payload.message + '</li>';
}