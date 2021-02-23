

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('room login', function(oldRoomName,oldUserName,newRoomName,newUserName) {

    if (oldRoomName!=""){
      io.to(oldRoomName).emit('chat message', "------"+ oldUserName+" left " +oldRoomName+"------");
      socket.leave(oldRoomName);
    }

    socket.join(newRoomName);
    io.to(newRoomName).emit('chat message',"------"+ newUserName+" entered " +newRoomName+"------");
    console.log("roomName:"+newRoomName+",userName : "+newUserName);

  });

  socket.on('chat message', (roomName,userName,msg) => {
    io.to(roomName).emit('chat message', "userName : "+userName+" > "+msg);
    console.log("roomName:"+roomName+",userName : "+userName+",msg:"+msg);
  });
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
