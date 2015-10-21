var io = require('socket.io')();
var ent = require('ent');
var clients = [];
var clientsIP = [];
var clientTurn = 1;

io.on('connection', function(socket){
  // New client
  console.log(socket.handshake.address);
  if(clientsIP.indexOf(socket.handshake.address) == -1){
    clients.push(socket.id);
    clientsIP.push(socket.handshake.address);
    io.to(clients[0]).emit('turn', '');
    clientTurn++;
    console.log('Client connected... socketId = '+ socket.id);
    console.log("clients id : "+clients);
    console.log("clients ip : "+clientsIP);
    console.log("send invitation to "+clients[0]);
  }else{
    var indexClient = clientsIP.indexOf(socket.handshake.address);
    clients[indexClient] = socket.id;
    console.log("socket id " + socket.id);
    console.log("refresh client id " + clients);
    io.to(clients[0]).emit('turn', '');
  }

  socket.on('join', function(msg){
    msg = ent.encode(msg);
    io.emit('join', msg);
  });

  socket.on('message', function (data) {
    data.message = ent.encode(data.message);
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
    },100);
  });

  socket.on('data', function (data) {
    socket.broadcast.emit('data', data);
  });

  var synchronized = [];
  socket.on('clientData', function (clientData) {
    console.log("server's data  "+synchronized);
    console.log("server received "+clientData);


    if(synchronized.length == 0){
      synchronized = clientData;
    }else{
      for(i=0;i<clientData.length;i++){

        //we remove the last element be cause ace editor closes automatically ( and { and [ and ' and "
        if(synchronized[i] != undefined){
          var index = synchronized[i].indexOf("){");
          if(index){
            synchronized[i].slice(index,1)
          }

          var index = synchronized[i].indexOf(")");
          if(index){
            synchronized[i].slice(index,1)
          }

          var index = synchronized[i].indexOf("'");
          if(index && index==synchronized.length-1){
            synchronized[i].slice(index,1)
          }

          var index = synchronized[i].indexOf("\"");

          if(index && index==synchronized.length-1){
            synchronized[i].slice(index,1)
          }

          var index = synchronized[i].indexOf("]");

          if(index && index==synchronized.length-1){
            synchronized[i].slice(index,1)
          }
          var tmp  = synchronized[i].substring(0, synchronized[i].length - 1);

        }

        if(clientData[i].indexOf(tmp) > -1 || synchronized[i] == undefined){
          synchronized[i] = clientData[i];
        }
      }
    }
    console.log("sever sent "+synchronized);
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
