var io = require('socket.io')();
var ent = require('ent');

io.on('connection', function(socket){
  console.log('Client connected...');

  socket.on('join', function(msg){
    msg = ent.encode(msg);
    io.emit('join', msg);
  });

  socket.on('message', function (data) {
    data.message = ent.encode(data.message);
    socket.broadcast.emit('message', data);
  });
});

module.exports = io;
