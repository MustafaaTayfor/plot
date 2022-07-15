const player = require('../controller/player');
let Player = require('../controller/player');
const cards = require('../models/cards');
let Card = require('../models/cards');


class GamePlot{
    

constructor (IdCreator){
    this.players = [null , null , null , null];
    this.buyersCard ;
    this.rolePlayer =1;
    this.playerKingdom =0;
    this.gameName = 'GamePlot' + this.IdCreator ;
        console.log('new Game ' , this.gameName);
}

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

  gameRest() {
       this.players = [null , null , null , null];
       this.allCards = [
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
            this.buyersCard  = null;
            this.rolePlayer =1;
            this.playerKingdom =0;
            console.log('game is rest');
    }



}
Games  = [
    new GamePlot('test'),

];


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
        return Games[0].players
    },
    handle: (socket)=>{
        let hasGameStarted = ()=>{
            return Games[0].players.find(player => ( player!= null && player.active == true))
        }

        let sortCards = ()=>{
            shuffle(Games[0].allCards);
            Games[0].buyersCard = Games[0].allCards[0];
            
            Games[0].allCards.splice(0 ,1);

            for(var p =0 ;p < 4;p++){
                if(Games[0].players[p] != null){
                    for(var i = 0;i<5 && Games[0].allCards.length>0;i++){
                        Games[0].players[p].cards.push(Games[0].allCards[0]);
                        Games[0].allCards.splice(0 ,1);
                    } 
                }
            }
            socket.server.to('PlotGame').emit('get players re' , { 'players':Games[0].players , 'buyersCard' : Games[0].buyersCard })
        }

        
        let playersNum = ()=> {
            var res =0;
            for(var i =0 ;i < Games[0].players.length;i++){
                if(Games[0].players[i] != null){
                    res++;
                }
            }
            return res
        }


        if(!hasGameStarted()){
            socket.on('join player', (data )=>{
                if(Games[0].players[data['index'] ] == null || Games[0].players[data['index']].email == data['user']['email']){
                    let nPlayer = Player.newPlayer(socket.id ,data['user']['id'] , data['user']['name'], data['user']['email'],  data['index'] );
                    Games[0].players[data['index']] = nPlayer;
                    socket.server.to('PlotGame').emit('join player re' ,{'data': data , 'players' : Games[0].players  } )
                    
                    console.log('player ', data['user']['name'] , ' is joined ', socket.id)
                    //socket.server.emit('update game' , players)
                }else{
                    socket.emit('game is full ' , data['user']['name'])
                    console.log('game is full ');
                }
            })   
        }

        socket.on('leave player', (data )=>{
                
            if(data['index']<4  && Games[0].players[data['index'] ] != null && Games[0].players[data['index']].email == data['user']['email']){
                Games[0].players[data['index']] = null;
                socket.server.to('PlotGame').emit('leave player re' ,{'data': data , 'players' : Games[0].players  } )
                socket.leave('PlotGame');
                if(playersNum() == 0){
                    Games[0].gameRest();
                }
                console.log('player ', data['user']['name'], ' is leaved')
                //socket.server.emit('update game' , players)
            }else {
                socket.server.to('PlotGame').emit('leave player re' ,{'data': data , 'players' : Games[0].players  } )
                socket.leave('PlotGame');
                console.log('cant leave player ' , data['user']['name'] , ' has index ', data['index'])
            }
        })

        socket.on('get players', (data )=>{
                socket.server.to('PlotGame').emit('get players re' , { 'players':Games[0].players , 'buyersCard' : Games[0].buyersCard })
                console.log('get players emit')
        })

        socket.on('start game', (data )=>{
            if(playersNum() == 4){
                sortCards();
            }
            socket.server.to('PlotGame').emit('start game re' , { 'playerKingdom':Games[0].playerKingdom , 'rolePlayer' : Games[0].rolePlayer })
            console.log('game started....')
        })
        socket.on('rest game', (data )=>{
            
            socket.server.to('PlotGame').emit('rest game re' , { 'playerKingdom':Games[0].playerKingdom , 'rolePlayer' : Games[0].rolePlayer })
            console.log('rest game.')
        })

        socket.on('on buy', (data )=>{
            Games[0].rolePlayer ++;
            if(Games[0].rolePlayer>=4){
                Games[0].playerKingdom++;
                Games[0].rolePlayer =0;
                if(Games[0].playerKingdom >=4){
                    Games[0].playerKingdom = 0;
                }
            }
        console.log('role :' , Games[0].rolePlayer);
            socket.server.to('PlotGame').emit('start game re' , { 'playerKingdom':Games[0].playerKingdom , 'rolePlayer' : Games[0].rolePlayer })
            //console.log('player name purchase : ' ,data['player']['name'] , ' purchase ' , data['player']['purchase'] , ' index : ' ,data['player']['index'] )
        })
    



        socket.on('pass turn' , ()=>{
            let current = Games[0].players.findIndex(palyer => player.active == true ),
            next = (current + 1) % Games[0].players.length

            if(current != -1 )Games[0].players[current].active = false
            Games[0].players[next].active = true
                socket.to('PlotGame').emit('update game' , Games[0].players)
        })

    },




}