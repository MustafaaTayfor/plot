const player = require('../controller/player');
let Player = require('../controller/player');
const cards = require('../models/cards');
let Card = require('../models/cards');
players = [null , null , null , null];
allCards = [
    Card.newCards({name : 'seven',  type : 'spades'}),
    Card.newCards({name : 'eight',  type : 'spades'}),
    Card.newCards({name : 'nine',  type : 'spades'}),
    Card.newCards({name : 'ten',  type : 'spades'}),
    Card.newCards({name : 'jack',  type : 'spades'}),
    Card.newCards({name : 'queen',  type : 'spades'}),
    Card.newCards({name : 'king',  type : 'spades'}),
    Card.newCards({name : 'one',  type : 'spades'}),

    Card.newCards({name : 'seven', type : 'hearts'}),
    Card.newCards({name : 'eight', type : 'hearts'}),
    Card.newCards({name : 'nine', type : 'hearts'}),
    Card.newCards({name : 'ten', type : 'hearts'}),
    Card.newCards({name : 'jack', type : 'hearts'}),
    Card.newCards({name : 'queen', type : 'hearts'}),
    Card.newCards({name : 'king', type : 'hearts'}),
    Card.newCards({name : 'one', type : 'hearts'}),

    Card.newCards({name : 'seven', type : 'clubs'}),
    Card.newCards({name : 'eight', type : 'clubs'}),
    Card.newCards({name : 'nine', type : 'clubs'}),
    Card.newCards({name : 'ten', type : 'clubs'}),
    Card.newCards({name : 'jack', type : 'clubs'}),
    Card.newCards({name : 'queen', type : 'clubs'}),
    Card.newCards({name : 'king', type : 'clubs'}),
    Card.newCards({name : 'one', type : 'clubs'}),

    Card.newCards({name : 'seven', type : 'diamonds'}),
    Card.newCards({name : 'eight', type : 'diamonds'}),
    Card.newCards({name : 'nine', type : 'diamonds'}),
    Card.newCards({name : 'ten', type : 'diamonds'}),
    Card.newCards({name : 'jack', type : 'diamonds'}),
    Card.newCards({name : 'queen', type : 'diamonds'}),
    Card.newCards({name : 'king', type : 'diamonds'}),
    Card.newCards({name : 'one', type : 'diamonds'}),
];

let buyersCard ;

function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }



module.exports = {
    players:()=>{
        return players
    },
    handle: (socket)=>{
        let hasGameStarted = ()=>{
            return players.find(player => ( player!= null && player.active == true))
        }

        let sortCards = ()=>{
            shuffle(allCards);
            buyersCard = allCards[0];
            allCards.splice(0 ,1);

            for(var p =0 ;p < players.length;p++){
                if(players[p] != null){
                    for(var i = 0;i<5 && allCards.length>0;i++){
                        players[p].cards.push(allCards[0]);
                        allCards.splice(0 ,1);
                    } 
                }
            }
            socket.server.to('PlotGame').emit('get players re' , players)
        }

        
        let playersNum = ()=> {
            var res =0;
            for(var i =0 ;i < players.length;i++){
                if(players[i] != null){
                    res++;
                }
            }
            return res
        }


        if(!hasGameStarted()){
            socket.on('join player', (data )=>{
                if(players[data['index'] ] == null || players[data['index']].email == data['user']['email']){
                    let nPlayer = Player.newPlayer(socket.id ,data['user']['id'] , data['user']['name'], data['user']['email'],  data['index'] );
                    players[data['index']] = nPlayer;
                    socket.server.to('PlotGame').emit('join player re' ,{'data': data , 'players' : players  } )
                    if(playersNum() == 4){
                        sortCards();
                    }
                    console.log('player ', data['user']['name'] , ' is joined ', socket.id)
                    //socket.server.emit('update game' , players)
                }else{
                    socket.emit('game is full ' , data['user']['name'])
                    console.log('game is full ');
                }
            })   
        }

        socket.on('leave player', (data )=>{
                
            if(data['index']<4  && players[data['index'] ] != null && players[data['index']].email == data['user']['email']){
                players[data['index']] = null;
                socket.server.to('PlotGame').emit('leave player re' ,{'data': data , 'players' : players  } )
                socket.leave('PlotGame');
                console.log('player ', data['user']['name'], ' is leaved')
                //socket.server.emit('update game' , players)
            }else {
                socket.server.to('PlotGame').emit('leave player re' ,{'data': data , 'players' : players  } )
                socket.leave('PlotGame');
                console.log('cant leave player ' , data['user']['name'] , ' has index ', data['index'])
            }
        })

        socket.on('get players', (data )=>{
                socket.server.to('PlotGame').emit('get players re' , players)
                console.log('get players emit')
        })

        socket.on('pass turn' , ()=>{
            let current = players.findIndex(palyer => player.active == true ),
            next = (current + 1) % players.length

            if(current != -1 )players[current].active = false
                players[next].active = true
                socket.to('PlotGame').emit('update game' , players)
        })

    },




}