let Player = require('../controller/player');
let Card = require('../models/cards');
players = [];
allCards = [];

module.exports = {
    players : ()=> {return players.length},
    handle: (socket)=>{
        console.log('players in game ' , players.length);
        let hasGameStarted = ()=>{
            return players.find(player => player.active == true)
        }
        if(!hasGameStarted()){
            socket.on('new player', (data )=>{
                if(players.length < 4){
                    console.log('player ', data['name'], ' is joined')
                    
                    players.push(Player.newPlayer(socket.id ,data['id'] , data['name'], data['email'], players.length ))
                    //socket.server.emit('update game' , players)
                    socket.server.emit('join player' ,{'data': data , 'players' : players  } )
                }else{
                    console.log('game is full ' , players.length);
                    socket.emit('game is full ' , data['name'])
                }
            })   
        }
        socket.on('pass turn' , ()=>{
            let current = players.findIndex(palyer => player.active == true ),
            next = (current + 1) % players.length

            if(current != -1 )players[current].active = false
                players[next].active = true
                socket.server.emit('update game' , players)
        })

    }



}