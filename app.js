const express = require('express');
const mongoose = require('mongoose');
const USERS = require ('./models/users');
const usersRoute = require('./route/users');
const messageRoute = require('./route/messages');
let Player = require('./controller/player');
const MESSAGE = require ('./models/message');
var bodyParser = require('body-parser');
const game = require('./controller/game');
const { players } = require('./controller/game');

const app  = express();
var PORT =process.env.PORT || 8080;
      


const server = app.listen(PORT , ()=>{
    console.log('Server is Started' , PORT);
});
const io =  require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', usersRoute);
app.use('/publicMessages', messageRoute);

app.post('/login', async(req , res )=>{
    console.log("login req");
    const email = req.body.email;
    const password = req.body.password;
    const user = await USERS.findOne({email : email , password:password} );
    console.log(user ,  ' ' ,email ,' ' ,password);
    if(user == null){
        res.json({
            'error': 'not found!'
            })
    }else{
        res.json({
            id  : user.id,
            name : user.name,
            email: user.email,
            password : user.password,
            })
    }
});










  mongoose.connect("mongodb+srv://saw_sy:DbMRfRJn4C9O0gNX@cluster0.1lcdj7a.mongodb.net/all-data?retryWrites=true&w=majority")
  .then(result => {
        console.log("mongosedb is connection");
  }).catch(err => {
        console.log( "error in mongosedb connection : " ,err);
  });

  
  io.on('connection',(socket)=>{

    // var clients = io.sockets.clients();
    game.handle(socket);
    console.log('Connected Successfully for ', socket.id);
    io.to(socket.id).emit('Connected-Successfully', '1');
    
        socket.on('disconnect',()=>{
        console.log('Desconnected' , socket.id , PORT);
     });


     socket.on('message', (data)=>{
         console.log('sended data from ' , data['sentById']);
         io.to(data['to']).emit('message-receive', data);
     });
     socket.on('publicMessage', async(data)=>{
        console.log('sended data from ' , data['from'] , ' ' ,data['text'] );
        const message = await new MESSAGE({
            text : data['text'],
            date : data['date'],
            from:  data['from'],
            email:  data['email'],
            userId:  mongoose.Types.ObjectId(data['userId']),
            type :  data['type'],
            voicePath :  data['voicePath'],
            }).save()
        io.emit('publicMessage-re', data);
    });

     socket.on('getClients', (data)=>{
         var clients = findClientsSocket();
         var arr = []; 
          clients.forEach((c)=>{
              console.log(c.id);
              arr.push(c.id);
          });

        io.emit('getClients-receive', arr);
     });
     var created = false;

     socket.on('create game', (data)=>{
        let nPlayer = Player.newPlayer(socket.id ,data['user']['id'] , data['user']['name'], data['user']['email'],  data['index'] );
        game.createGame(socket,nPlayer);
        console.log('create game by ' , data['user']['name'] );
    });

    socket.on('find game to join', (data)=>{
        game.findEmptyGame(socket);
        console.log('find game to join..... ');
    });




});



  function findClientsSocket(roomId, namespace) {
      var res = []
      // the default namespace is "/"
      , ns = io.of(namespace ||"/");

      if (ns) {
          for (var id in ns.connected) {
              if(roomId) {
                  var index = ns.connected[id].rooms.indexOf(roomId);
                  if(index !== -1) {
                      res.push(ns.connected[id]);
                  }
              } else {
                  res.push(ns.connected[id]);
              }
          }
      }
      return res;
  }
  

module.exports = app;

  
