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
  var myUsername;

  // Area for Chat room function
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
  
    if (payload.user == myUsername) {
      chat.append(genmybubble(payload));
    }else{
      chat.append(genyourbubble(payload));
    }
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
  });

  // Area for User function
  userForm.submit(function(event){
    event.preventDefault();
    var usernametemp = username.val()
    if ($.trim(usernametemp) != '') {
      socket.emit('newUser', usernametemp, function(confirm){
        if(confirm){
          myUsername=usernametemp;
          userFormArea.hide();
          messageFormArea.show();
          messagesinput.focus();
        }else{
          username.val('');
          alert("Username is already taken.");
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

// Custom function
function genmybubble(payload){
  return '<div class="bubble me">'+ payload.message + '</div>';
}
function genyourbubble(payload){
  return '<div class="yourusername"><strong>' +payload.user+ '</strong></div><div class="bubble you">' + payload.message + '</div>';
}