const dotenv = require('dotenv');
const app = require('./app');
const port = process.env.PORT || 5000;
const server = app.listen(port, ()=>{
    console.log(`App Running on ${port}...`);
});
const io = require('socket.io')(server, {
  ingTimeout: 60000,
  cors: {
    origin: "*"
  }
});

io.on('connection', (socket)=>{
  console.log(`Connected to socket.io server ${socket.id}`);
  socket.on('join-room', (room)=>{
    socket.join(room);
    console.log(`joined ${room}`);
  })
  socket.on('send-message', (message, room)=>{
    console.log('sending message...');
    socket.to(room).emit('receive-message',message, room);
  });
  socket.on('updateChatrooms', (chatrooms)=>{
    console.log(`update all chatrooms`);
    socket.broadcast.emit('receive-chatrooms-update',chatrooms);
  })
});


// TODO: Restart App when uncaughtException occurs https://pm2.io/docs/runtime/best-practices/graceful-shutdown/
// process.on('uncaughtException', err=>{
//     console.log(err.name, err.message);
//     console.log('Unhandled Rejection, App is going to shutdown');
//     server.close(()=>{//will shutdown after all the process is finished
//       process.exit(1); //shutdown application 0=success 1=uncaught exception
//     });
//     });
    process.on('SIGTERM', ()=>{
      console.log('SIGTERM RECEIVED. shutting down gracefully');
      server.close(()=>{
        console.log('Process terminated');
      });
    });