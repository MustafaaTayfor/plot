const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');

var bodyParser = require('body-parser');

const app  = express();
var PORT =process.env.PORT || 8080;
      
var user_online  =new Map();

const server = app.listen(PORT , ()=>{
    console.log('Server is Started' , PORT);
});
const io =  require('socket.io')(server);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

  
  io.on('connection',(socket)=>{

    //var clients = io.sockets.clients();
    console.log('connected successfully for ', socket.id);
    io.to(socket.id).emit('connected-successfully', '1');


    socket.on('online', async(data)=>{
        console.log('user ' , data['id'] , ' is online now' );
        user_online.set(data['id'], socket.id);

        io.to(socket.id).emit('set-online', 'you are online');
    });

    
    socket.on('disconnect',()=>{
       
        user_online.forEach((value, key) => {
            if (value === socket.id) {
                console.log('user ' , key , ' is offline now' );
                user_online.delete(key);
            }
        });
       console.log('Desconnected' , socket.id , PORT);
    });


     socket.on('message', (data)=>{

        // إرسال البيانات إلى السيرفر الثاني
        axios.post('https://karam-app.com/chat_app/public/api/add-chat', data).then(response => {

            io.to(user_online.get(data['user2_id'])).emit('message-receive', response.data);
            io.to(user_online.get(data['user_id'])).emit('message-receive', response.data);

            console.log(user_online);
            console.log(response.data ,user_online.get(data['user2_id']),user_online.get(data['user_id']) ,data['user2_id']);
        }).catch(error => {

            console.log(error.message);
        });

        
         
     });


     socket.on('public-message', async(data)=>{
        console.log('sended data from ' , data['from'] , ' ' ,data['text'] );
        
        io.emit('public-message-receive', data);
    });



     socket.on('get-clients', (data)=>{
         /* var clients = findClientsSocket();
         var arr = []; 
          clients.forEach((c)=>{
              console.log(c.id);
              arr.push(c.id);
          }); */

        io.emit('get-clients-receive', user_online);
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

  
