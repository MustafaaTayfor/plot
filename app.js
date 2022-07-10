const express = require('express');
const mongoose = require('mongoose');
const USERS = require ('./models/users');
const usersRoute = require('./route/users');

var bodyParser = require('body-parser');

const app  = express();
var PORT =process.env.PORT || 8080;
      


const server = app.listen(PORT , ()=>{
    console.log('Server is Started' , PORT);
});
const io =  require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/users', usersRoute);

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


  mongoose.connect("mongodb+srv://sawSy:9OP4J1pQp1It9Dh1@plotgameapp.sbbcz.mongodb.net/plot_api?retryWrites=true&w=majority")
  .then(result => {
        console.log("mongosedb is connection");

        io.on('connection',(socket)=>{
            // var clients = io.sockets.clients();
            console.log('Connected Successfully for ', socket.id);
            io.to(socket.id).emit('Connected-Successfully', '1');
            
             socket.on('disconnect',()=>{

                 
                 console.log('Desconnected' , socket.id , PORT);
             });
     
             socket.on('message', (data)=>{
                 console.log('sended data from ' , data['sentById']);
                 io.to(data['to']).emit('message-receive', data);
             });
             socket.on('publicMessage', (data)=>{
                io.emit('publicMessage-re', data);
            });
    
     
             socket.on('getClients', (data)=>{
                 var clients = findClientsSocket();
                 var arr = []; 
                  clients.forEach((c)=>{
                      //console.log(c.id);
                      arr.push(c.id);
                  });
     
                io.to(data['id']).emit('getClients-receive', arr);
             });
     
     });


  }).catch(err => {
        console.log( "hi this is my error : " ,err);
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

  
