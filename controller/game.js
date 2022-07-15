const player = require('../controller/player');
let Player = require('../controller/player');
const cards = require('../models/cards');
let Card = require('../models/cards');
players = [null , null , null , null];
allCards = [
    Card.newCards( 'seven', 'spades'),
    Card.newCards('eight',  'spades'),
    Card.newCards( 'nine',  'spades'),
    Card.newCards( 'ten',  'spades'),
    Card.newCards( 'jack',  'spades'),
    Card.newCards( 'queen',  'spades'),
    Card.newCards( 'king',  'spades'),
    Card.newCards( 'one',  'spades'),

    Card.newCards( 'seven', 'hearts'),
    Card.newCards( 'eight', 'hearts'),
    Card.newCards( 'nine', 'hearts'),
    Card.newCards( 'ten', 'hearts'),
    Card.newCards( 'jack', 'hearts'),
    Card.newCards( 'queen', 'hearts'),
    Card.newCards( 'king', 'hearts'),
    Card.newCards( 'one', 'hearts'),

    Card.newCards( 'seven', 'clubs'),
    Card.newCards( 'eight', 'clubs'),
    Card.newCards( 'nine', 'clubs'),
    Card.newCards( 'ten', 'clubs'),
    Card.newCards( 'jack', 'clubs'),
    Card.newCards( 'queen', 'clubs'),
    Card.newCards( 'king', 'clubs'),
    Card.newCards( 'one', 'clubs'),

    Card.newCards( 'seven', 'diamonds'),
    Card.newCards( 'eight', 'diamonds'),
    Card.newCards( 'nine', 'diamonds'),
    Card.newCards( 'ten', 'diamonds'),
    Card.newCards( 'jack', 'diamonds'),
    Card.newCards( 'queen', 'diamonds'),
    Card.newCards( 'king', 'diamonds'),
    Card.newCards( 'one', 'diamonds'),
];

let buyersCard ;

let rolePlayer =1;
let playerKingdom =0;

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

            for(var p =0 ;p < 4;p++){
                if(players[p] != null){
                    for(var i = 0;i<5 && allCards.length>0;i++){
                        players[p].cards.push(allCards[0]);
                        allCards.splice(0 ,1);
                        console.log(allCards[0])
                    } 
                }
            }
            socket.server.to('PlotGame').emit('get players re' , { 'players':players , 'buyersCard' : buyersCard })
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
                socket.server.to('PlotGame').emit('get players re' , { 'players':players , 'buyersCard' : buyersCard })
                console.log('get players emit')
        })

        socket.on('start game', (data )=>{
            socket.server.to('PlotGame').emit('start game re' , { 'playerKingdom':playerKingdom , 'rolePlayer' : rolePlayer })
            console.log('game started....')
        })

        socket.on('on buy', (data )=>{
            rolePlayer ++;
            if(rolePlayer>=4){
                playerKingdom++;
                rolePlayer =0;
                if(playerKingdom >=4){
                    playerKingdom = 0;
                }
            }
        console.log('role :' , rolePlayer);
            socket.server.to('PlotGame').emit('start game re' , { 'playerKingdom':playerKingdom , 'rolePlayer' : rolePlayer })
            //console.log('player name purchase : ' ,data['player']['name'] , ' purchase ' , data['player']['purchase'] , ' index : ' ,data['player']['index'] )
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