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
    socket.on('turn', function() {
    if(update){
     var data = editor.session.getValue().split('\n');
      console.log("client sent updates "+data);
      if(data.length != 0){
          socket.emit('clientData',data);
        }

    update = false;
  }else{
    console.log("It's my turn but there is not updates!");
  }
    socket.emit('next', 'try next');
  });

// i touched textarea means there is updates
$("#editor").keyup(function(evt) {
  update = true;
});
  var myData = [];

 socket.on('refreshClient', function(data) {
editor.$blockScrolling = Infinity;
  myData = editor.session.getValue().split('\n');
  var empty = myData.indexOf("");
  myData.splice(empty);
  console.log(myData);
  //sauvegarder le cursor
  var cursor=  editor.selection.getCursor();

  //data = $.grep(data,function(n){ return(n) });
  console.log("data send to me "+data);
  console.log("my data "+myData);

    for(i=0;i<data.length;i++){
    //  console.log(" i = "+i);
    //  console.log(" data[i] = "+data[i]);
    //  console.log(" myData[i] = "+myData[i]);

    //we remove the last element be cause ace editor closes automatically ( and { and [
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
      }else{
        if(data[i].trim() != "" && myData.indexOf("<<<") == -1 && myData.indexOf(">>>") == -1 && myData.indexOf("vs") == -1){
            myData[i] = "<<<   "+myData[i]+" >>>" + "vs <<<"+data[i] + ">>>";
        }
      }
    }

  var content ="";
     for(i=0;i<myData.length;i++){
    //  console.log(myData.length);
      content+=myData[i]+"\n";
  }
  //console.log("content" +content);
  //console.log(cursor);
  //bloquer l'écriture quand on m'envoie une mise a jour

  editor.setReadOnly(true);
  editor.session.setValue(content);
  editor.selection.moveCursorTo(cursor.row,cursor.column,false);
  editor.setReadOnly(false);
  //mettre le curseur la ou il été
});

/*
   socket.on('data', function(data) {
  //  console.log("client received data "+myData.length);
  myData = $.grep(myData,function(n){ return(n) });
  data.content =  $.grep(data.content,function(n){ return(n) });
  console.log(myData);
    if(myData.length == 0){
      myData = data.content;
    }else{
      for(i=0;i<data.content.length;i++){
        if(data.content[i].indexOf(myData[i]) > -1){
          myData[i] = data.content[i];
        }
      }
    }
    var content ="";
       for(i=0;i<myData.length;i++){
        console.log(myData.length);
        content+=myData[i]+"\n";
    }

  	 editor.session.setValue(content);
  })
*/

  socket.on('message', function(data) {
    generateBox(data, 'other');
  })

//  myRelease = 0;
//  var busy = 0;
//  $("#editor").keyup(function(evt) {
//	myData = editor.session.getValue().split('\n');
    //  console.log(editor.selection.getCursor());
    //console.log("-");
    //  var data = new Object();
    //  data.content=content;
    //  data.myRelease=myRelease;
    //	socket.emit('send',  1);
  	//	socket.emit('data',  data);
    //  socket.emit('send',  0);
  //  myRelease++;
	//});

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
