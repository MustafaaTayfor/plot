let Player = require('../controller/player');
let Card = require('../models/cards');
players = [];
allCards = [];

module.exports = {
    players : ()=> {return players.length},
    handle: (socket)=>{
        socket.join('PlotGame');
        let hasGameStarted = ()=>{
            return players.find(player => player.active == true)
        }
        if(!hasGameStarted()){
            socket.on('new player', (data )=>{
                if(players.length < 4){
                    players.push(Player.newPlayer(socket.id ,data['id'] , data['name'], data['email'], players.length ))
                    socket.to('PlotGame').emit('join player' ,{'data': data , 'players' : players  } )
                    console.log('player ', data['name'], ' is joined , number is ' , players.length)
                    //socket.server.emit('update game' , players)
                }else{
                    socket.emit('game is full ' , data['name'])
                    console.log('game is full ' , players.length);
                }
            })   
        }
        socket.on('pass turn' , ()=>{
            let current = players.findIndex(palyer => player.active == true ),
            next = (current + 1) % players.length

            if(current != -1 )players[current].active = false
                players[next].active = true
                socket.to('PlotGame').emit('update game' , players)
        })

    }



}