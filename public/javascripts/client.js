
jQuery(document).ready(function($) {

  var n = Math.floor(Math.random() * 10) + 1;
  document.img_url = "http://lorempixel.com/600/600/people/"+n

  var socket = io.connect(window.location.origin);

  socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
  });

  socket.on('join', function(pseudo) {
    console.log('A Client Joined the room');
  })

    var update = true;
  //   socket.on('turn', function() {
  //   if(update){
  //    var data = editor.session.getValue().split('\n');
  //     console.log("client sent updates "+data);
  //     if(data.length != 0){
  //         socket.emit('clientData',data);
  //       }
  //
  //   update = false;
  // }else{
  //   console.log("It's my turn but there is not updates!");
  // }
  //   socket.emit('next', 'try next');
  // });

// i touched textarea means there is updates
$("#editor").keyup(function(evt) {
  var rowNB = editor.selection.getCursor().row;
  var myData = editor.session.getValue().split('\n');
  var dataToSend = myData[rowNB];
  var data = new Object();
  data.rowContent = dataToSend;
  data.rowNB = rowNB;
  socket.emit('clientData',data);
  console.log("client sent "+data.rowContent);
  //update = true;
});
  var myData = [];

 socket.on('refreshClient', function(data) {
  editor.setReadOnly(true);
  console.log("data send to me "+data);

    for(i=0;i<data.length;i++){

       if(myData[i] != undefined){
        var index = myData[i].indexOf("){");
        if(index){
          myData[i] =   myData[i].substring(0, myData.length - 1);
          myData[i] =   myData[i].substring(0, myData.length - 1);
        }

        var index = myData[i].indexOf(")");
        if(index){
          myData[i] =   myData[i].substring(0, myData.length - 1);

        }

        var index = myData[i].indexOf("]");
        if(index){
          myData[i] =   myData[i].substring(0, myData.length - 1);

        }

        var index = myData[i].indexOf("'");
        if(index){
          myData[i] =   myData[i].substring(0, myData.length - 1);

        }
        var index = myData[i].indexOf("\"");
        if(index){
          myData[i] =   myData[i].substring(0, myData.length - 1);

        }
      }



      if(data[i].indexOf(myData[i]) > -1 || myData[i] == undefined){
        myData[i] = data[i];
      }
      // else{
      //   if(myData.indexOf("<<<") == -1 && myData.indexOf(">>>") == -1 && myData.indexOf("vs") == -1){
      //       myData[i] = "<<<   "+myData[i]+" >>>" + "vs <<<"+data[i] + ">>>";
      //   }
      // }
    }

  var content ="";
     for(i=0;i<myData.length;i++){
      content+=myData[i]+"\n";
  }
  var cursor=  editor.selection.getCursor();
  editor.session.setValue(content);
  editor.selection.moveCursorTo(cursor.row,cursor.column,false);
  editor.setReadOnly(false);

});
   socket.on('message', function(data) {
    generateBox(data, 'other');
  })


  $('#hide_chat').click(function(event) {
    event.preventDefault();
    if ($(this).data('click') == 'show') {
      $(this).text('keyboard_arrow_up').data('click', 'hide').
      closest('.module').find('#messages_container').slideUp();
    } else {
      $(this).text('keyboard_arrow_down').data('click', 'show').
      closest('.module').find('#messages_container').slideDown();
    }
  })

  $('#message_field').keypress(function(event) {
    if(event.which == 13 && !event.shiftKey) {
      event.preventDefault();
      var message = $.trim($(this).val());
      if (message.length > 0){
        socket.emit('message', { message: message, img: document.img_url });
		//socket.emit('content',  editor.session.getValue());

        generateBox({ message: message, img: document.img_url }, 'self');
        $(this).val('');
      }
    }
  })

  function generateBox(data, kclass) {
    var discussion = $('.discussion');
    var li = $('<li></li>').addClass(kclass);
    var content = simpleFormat(data.message);
    var img = $('<img />').attr('src', data.img);
    var avatar = $('<div></div>').addClass('avatar').append(img);
    var dt = $('<time></time>').attr('datetime', '2009-11-13T20:14').text('17 mins');
    var msg = $('<div></div>').addClass('messages').append(content);

    li.append(avatar).append(msg)
    discussion.append(li);
    discussion.animate({ scrollTop: discussion[0].scrollHeight }, 1000)
  }

  function simpleFormat(str) {
    str = str.replace(/\r\n?/, "\n");
    str = $.trim(str);
    if (str.length > 0) {
      str = str.replace(/\n\n+/g, '</p><p>');
      str = str.replace(/\n/g, '<br />');
      str = '<p>' + str + '</p>';
    }
    return str;
  }
})
