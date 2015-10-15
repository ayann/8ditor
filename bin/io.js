var io = require('socket.io')();
var ent = require('ent');
var clients = [];
var clientsIP = [];
var clientTurn = 1;
var synchronized = [];

io.on('connection', function(socket){
  // New client
  console.log(socket.handshake.address);
  if(clientsIP.indexOf(socket.handshake.address) == -1){
    clients.push(socket.id);
    clientsIP.push(socket.handshake.address);
    io.to(clients[0]).emit('turn', '');
    clientTurn++;
  //   console.log('Client connected... socketId = '+ socket.id);
  //   console.log("clients id : "+clients);
  //   console.log("clients ip : "+clientsIP);
  //   console.log("send invitation to "+clients[0]);
   }else{
    var indexClient = clientsIP.indexOf(socket.handshake.address);
    clients[indexClient] = socket.id;
  //  console.log("socket id " + socket.id);
  //  console.log("refresh client id " + clients);
    //io.to(clients[0]).emit('turn', '');
  }

  // When client send a chat message
  socket.on('message', function (data) {
    socket.broadcast.emit('message', data);
  });

  socket.on('next', function () {

     var i = clientTurn;
    if(i >= clients.length){
      i = clientTurn%clients.length;
    }
  //  console.log("clientTurn "+i);
    setTimeout(function(){
      io.to(clients[i]).emit('turn', '');
      console.log("send invitation to "+clients[i]);
    //  console.log('i '+clients[i]);
      clientTurn++;
    },1000);
  });

  socket.on('data', function (data) {
    socket.broadcast.emit('data', data);
  });


  socket.on('clientData', function (clientData) {
    console.log("server's data  "+synchronized);
    console.log("server received "+clientData.rowContent);
    console.log(synchronized.length);

    if(synchronized[clientData.rowNB] == undefined){
      synchronized[clientData.rowNB] = clientData.rowContent;
      console.log("line not exist");
      console.log(clientData.rowContent);
      console.log(clientData.rowNB);
    }
    else{
      console.log("synchronized before : "+synchronized);
      synchronized[clientData.rowNB] = clientData.rowContent;
      console.log("line exist");
      console.log(clientData.rowContent);
      console.log(clientData.rowNB);
      console.log('synchronized[clientData.rowNB] = ' +synchronized[clientData.rowNB]);
    }
    console.log("server sent "+synchronized);
  socket.broadcast.emit('refreshClient', synchronized);
  });
/*
   socket.on ( "disconnect" , function ()
        {
          var i = clients.indexOf(socket.id);
          clients.splice(i,1);
          i = clientsIP.indexOf(socket.handshake.address);
          clientsIP.splice(i,1);
          console.log ( "closed "+socket.id );
          console.log(clients);
          console.log(clientsIP);
        });
*/
});

module.exports = io;
