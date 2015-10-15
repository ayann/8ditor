jQuery(document).ready(function($) {
  // Init io on document is ready
  var socket;
  init_io()

  // Set client color. This is required to identify client on chat box
  document.color = randomize_color();

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
        socket.emit('message', { message: message, color: document.color });
        generateBox({ message: message, color: document.color }, 'self');
        $(this).val('');
      }
    }
  })

  function generateBox(data, kclass) {
    var discussion = $('.discussion');
    var li = $('<li></li>').addClass(kclass);
    var content = simpleFormat(data.message);
    // var img = $('<img />').attr('src', data.img);
    var aColor = $('<div></div>').addClass('img').css('backgroundColor', data.color);
    console.log(data.color);
    var avatar = $('<div></div>').addClass('avatar').append(aColor);
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

  function init_io() {
    socket = io.connect(window.location.origin);

    socket.on('connect', function(data) {
      sessionId = socket.io.engine.id;
      console.log('Connected ' + sessionId);
      socket.emit('join', {id: sessionId, name: 'tototo' });
    });

    socket.on('join', function(pseudo) {
      console.log('A Client Joined the room');
    })

    socket.on('message', function(data) {
      generateBox(data, 'other');
    })
  }

  function randomize_color() {
    var rd = function() {
      return Math.floor((256-199) * Math.random() + 80)
    }

    var CRed   = rd();
    var CGreen = rd();
    var CBlue  = rd();
    return 'rgb(' + CRed + ',' + CGreen + ',' + CBlue + ')';
  }
})
