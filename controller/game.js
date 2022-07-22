const player = require('../controller/player');
let Player = require('../controller/player');
const cards = require('../models/cards');
let Card = require('../models/cards');

 const name_card = { one: "one" , two : "two" , three : "three", four : "four", five : "five", six : "six", seven : "seven", eight:"eight", nine :"nine" , ten:"ten" ,king :"king", queen:"queen"  , jack : "jack"}
 const type_card = { diamonds:"diamonds" , spades:"spades", hearts : "hearts" ,  clubs : "clubs"}
 const type_game = { san:"san" , pass :"pass" , hakam :"hakam" , ashkel :"ashkel" , wla:"wla" , hakam2 : "hakam2", double : "double" , before :"before" }



class GamePlot{
    
constructor (creatorPlayer){
    
    this.buyersCard = null;
    this.buyerType = null;
    this.gameStarted = false;
    this.creatorPlayer = creatorPlayer;
    this.players = [creatorPlayer , null , null , null];
    this.rolePlayer =0;
    this.playerKingdom =0;
    this.showTypeGameDialog = false;
    this.showStartDialog = true;

    this.gameName = 'plot' + this.creatorPlayer.userId + Date(Date.now()).toString();
    this.gameIndex;

    this.allCards = [
        Card.newCards(name_card.seven, type_card.spades),
        Card.newCards(name_card.eight, type_card.spades),
        Card.newCards(name_card.nine, type_card.spades),
        Card.newCards(name_card.ten, type_card.spades),
        Card.newCards(name_card.jack, type_card.spades),
        Card.newCards(name_card.queen, type_card.spades),
        Card.newCards(name_card.king, type_card.spades),
        Card.newCards(name_card.one, type_card.spades),

        Card.newCards(name_card.seven, type_card.hearts),
        Card.newCards(name_card.eight, type_card.hearts),
        Card.newCards(name_card.nine, type_card.hearts),
        Card.newCards(name_card.ten, type_card.hearts),
        Card.newCards(name_card.jack, type_card.hearts),
        Card.newCards(name_card.queen, type_card.hearts),
        Card.newCards(name_card.king, type_card.hearts),
        Card.newCards(name_card.one, type_card.hearts),

        Card.newCards(name_card.seven, type_card.clubs),
        Card.newCards(name_card.eight, type_card.clubs),
        Card.newCards(name_card.nine, type_card.clubs),
        Card.newCards(name_card.ten, type_card.clubs),
        Card.newCards(name_card.jack, type_card.clubs),
        Card.newCards(name_card.queen, type_card.clubs),
        Card.newCards(name_card.king, type_card.clubs),
        Card.newCards(name_card.one, type_card.clubs),

        Card.newCards(name_card.seven, type_card.diamonds),
        Card.newCards(name_card.eight, type_card.diamonds),
        Card.newCards(name_card.nine, type_card.diamonds),
        Card.newCards(name_card.ten, type_card.diamonds),
        Card.newCards(name_card.jack, type_card.diamonds),
        Card.newCards(name_card.queen, type_card.diamonds),
        Card.newCards(name_card.king, type_card.diamonds),
        Card.newCards(name_card.one, type_card.diamonds),
    ];

    console.log('new Game ' , this.gameName , ' by ' , this.creatorPlayer.userId );
}

toJSON(){
    return {
        'buyersCard':  this.buyersCard,
        'buyerType' : this.buyerType,
        'gameStarted': this.gameStarted,
        'creatorPlayer':this.creatorPlayer,
        'players': this.players,
        'rolePlayer' : this.rolePlayer,
        'playerKingdom':this.playerKingdom,
        'gameName' : this.gameName,
        'gameIndex' :this.gameIndex,
        'showTypeGameDialog': this.showTypeGameDialog,
        'showStartDialog':this.showStartDialog,
    }

}


playerIndex (p){
    return this.players.findIndex(palyer => { return   ( palyer != null && palyer.id == p.id)});
}

playersNum (){
    var res =0;
    for(var i =0 ;i < 4;i++){
        if(this.players[i] != null){
            res++;
        }
    }
    return res
}


distributingCards(){
    shuffle(this.allCards);

    this.gameStarted = true;

    if(this.buyersCard == null){
        this.buyersCard = this.allCards[0];          
        this.allCards.splice(0 ,1);
        
        for(var j =0 ;j < 4;j++){
            if(this.players[j] != null){
                for(var i = 0;i<5 && this.allCards.length>0;i++){
                    this.players[j].cards.push(this.allCards[0]);
                    this.allCards.splice(0 ,1);
                }
            }
        }

    }else{
        for(var i =0 ; i< 4 ; i++){

            if(this.players[i] != null){
                if(this.players[i].id == this.creatorPlayer.id){

                    this.players[i].Cards.push(this.buyersCard);
                    this.buyersCard = null;
                    this.players[i].cards.push(this.allCards[0]);
                    this.players[i].cards.push(this.allCards[1]);
                    this.allCards.splice(0 ,2);
                    
                }else{
                    for(var j = 0;j<3 && this.allCards.length>0;j++){
                        this.players[i].cards.push(this.allCards[0]);
                        this.allCards.splice(0 ,1);
                    }
                }
            }

        }

        
    }
}


gameRest() {
    this.players = [null , null , null , null];
    this.allCards = [
        Card.newCards(name_card.seven, type_card.spades),
        Card.newCards(name_card.eight, type_card.spades),
        Card.newCards(name_card.nine, type_card.spades),
        Card.newCards(name_card.ten, type_card.spades),
        Card.newCards(name_card.jack, type_card.spades),
        Card.newCards(name_card.queen, type_card.spades),
        Card.newCards(name_card.king, type_card.spades),
        Card.newCards(name_card.one, type_card.spades),

        Card.newCards(name_card.seven, type_card.hearts),
        Card.newCards(name_card.eight, type_card.hearts),
        Card.newCards(name_card.nine, type_card.hearts),
        Card.newCards(name_card.ten, type_card.hearts),
        Card.newCards(name_card.jack, type_card.hearts),
        Card.newCards(name_card.queen, type_card.hearts),
        Card.newCards(name_card.king, type_card.hearts),
        Card.newCards(name_card.one, type_card.hearts),

        Card.newCards(name_card.seven, type_card.clubs),
        Card.newCards(name_card.eight, type_card.clubs),
        Card.newCards(name_card.nine, type_card.clubs),
        Card.newCards(name_card.ten, type_card.clubs),
        Card.newCards(name_card.jack, type_card.clubs),
        Card.newCards(name_card.queen, type_card.clubs),
        Card.newCards(name_card.king, type_card.clubs),
        Card.newCards(name_card.one, type_card.clubs),

        Card.newCards(name_card.seven, type_card.diamonds),
        Card.newCards(name_card.eight, type_card.diamonds),
        Card.newCards(name_card.nine, type_card.diamonds),
        Card.newCards(name_card.ten, type_card.diamonds),
        Card.newCards(name_card.jack, type_card.diamonds),
        Card.newCards(name_card.queen, type_card.diamonds),
        Card.newCards(name_card.king, type_card.diamonds),
        Card.newCards(name_card.one, type_card.diamonds),
    ];
    this.buyersCard  = null;
    this.rolePlayer =1;
    this.playerKingdom =0;
        console.log('game is rest');
}

getBuyers(index){

    var purchaseIndex = null;

    // اذا كان احد اللاعبين مختار صن

    for(var i = 0 ; i< this.players.length ; i++){
        if(this.players[i].purchase == type_game.san)
            purchaseIndex = i;
    }

    if( purchaseIndex != null){
        if(index == this.playerKingdom || index == (this.playerKingdom+3)%4 )
        return [type_game.pass , type_game.ashkel , type_game.before ];
        else
        return [type_game.pass , type_game.before ];
    }


    // اذا كان احد اللاعبين مختار حكم

    for( i = 0 ; i< this.players.length ; i++){
        if(this.players[i].purchase == type_game.hakam)
            purchaseIndex = i;
    }

    if( purchaseIndex != null){
        if(index == this.playerKingdom || index == (this.playerKingdom+3)%4 )
        return [type_game.pass , type_game.san ,type_game.ashkel];
        else
        return [type_game.pass , type_game.san , type_game.double];
    }



    //  7 - 8 - Q - K - 10 - A - 9 - J.  :حكم
    //  7 - 8 - 9 - J - Q - K - 10 - A.   :صن
    //  ذا كان اللاعب لم يشتري بعد
    if(this.players[purchaseIndex]  == null){

        if(index == this.playerKingdom || index == (this.playerKingdom+3)%4 )
        return [type_game.pass , type_game.san ,type_game.hakam , type_game.ashkel];
        else
        return [type_game.pass , type_game.san ,type_game.hakam  ];

    // اذا كان اللاعب مختار بس في الدورة الاولى ولم يختر احد صن او حكم ثاني
    }else{

        if(index == this.playerKingdom || index == (this.playerKingdom+3)%4 )
        return [type_game.wla , type_game.san , type_game.hakam2 , type_game.ashkel];
        else
        return [type_game.wla , type_game.san ,  type_game.hakam2];

    }
    

}


passTurn(){
    this.rolePlayer ++;
    if(this.rolePlayer>=4){
        this.playerKingdom++;
        this.rolePlayer =0;
        if(this.playerKingdom >=4){
            this.playerKingdom = 0;
        }
    }
console.log('role : ' , this.rolePlayer , ' for Game ' , this.gameName );
}

}



Games  = [];


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

    // PC  = Player Creator
    createGame: (socket, PC)=>{
        myGame = new GamePlot(PC);
        Games.push(myGame);
        let indexGame = Games.findIndex(game => {return game.gameName == myGame.gameName});
        Games[indexGame].gameIndex = indexGame;

        socket.join(myGame.gameName);
        socket.emit('create-game-re',myGame.toJSON());
    },

    findEmptyGame:(socket)=>{
       let emptyGameIndex = Games.findIndex(game => {return game.playersNum() <4});
       if(emptyGameIndex != -1){
        socket.join(Games[emptyGameIndex].gameName);
           socket.emit('create-game-re',Games[emptyGameIndex].toJSON());
       }
    },

    
    handle: (socket)=>{

        socket.on('join player', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;
            
            if(Games[indexGame].players[data['index']] == null || Games[indexGame].players[data['index']].email == data['user']['email']){
                
                let nPlayer = Player.newPlayer(socket.id ,data['user']['id'] , data['user']['name'], data['user']['email'],  data['index'] );
                
                //اذا اللاعب موجود بالفعل داخل اللعبة اخبر اللاعب مكان جلوسه وامنعه من الدخول
                if(Games[indexGame].playerIndex(nPlayer) != -1 && false){
                    socket.server.to(myGame.gameName).emit('You are already in the game' ,{'data': data , 'playersIndex' :Games[indexGame].playerIndex(nPlayer)});
                    console.log('You are already in the game ', Games[indexGame].gameName , ' your index is ' , Games[indexGame].playerIndex(nPlayer));
                    return;
                }
                
                Games[indexGame].players[data['index']] = nPlayer;
                socket.server.to(myGame.gameName).emit('join player re' ,{'data': data , 'players' : Games[indexGame].players  } )    
                console.log('player ', data['user']['name'] , ' is joined ', socket.id)
            }else{
                socket.emit('game is full ' , data['user']['name'])
                console.log('game is full ');
            }
        })
        

        socket.on('leave player', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;

            if(data['index']<4  && Games[indexGame].players[data['index'] ] != null && Games[indexGame].players[data['index']].email == data['user']['email']){
                Games[indexGame].players[data['index']] = null;
                if(Games[indexGame].playersNum() == 0){
                    Games[indexGame].gameRest();
                }
                console.log('player ', data['user']['name'], ' is leaved')
            }else {
                console.log('cant leave player ' , data['user']['name'] , ' has index ', data['index'])
            }
            socket.server.to(myGame.gameName).emit('leave player re' ,{'data': data , 'players' : Games[indexGame].players  } )
            socket.leave(myGame.gameName);
        })

        socket.on('get players', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;
            socket.server.sockets.in(myGame.gameName).emit('get players re' , { 'players':Games[indexGame].players , 'buyersCard' : Games[indexGame].buyersCard })
            console.log('get players emit')
        })

        socket.on('start game', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;
            if(Games[indexGame].playersNum() == 4){
                Games[indexGame].distributingCards();
                Games[indexGame].showStartDialog =false;
                Games[indexGame].showTypeGameDialog=true;

                
                socket.emit('get buyers re',Games[indexGame].getBuyers(Games[indexGame].rolePlayer));
                socket.emit('create-game-re',Games[indexGame].toJSON());
                socket.server.to(myGame.gameName).emit('start game re' , { 'playerKingdom':Games[indexGame].playerKingdom , 'rolePlayer' : Games[indexGame].rolePlayer })
                console.log('game started....')
            }
        })



        socket.on('rest game', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;
            Games[indexGame].gameRest();
            socket.server.to(myGame.gameName).emit('rest game re' , { 'playerKingdom':Games[indexGame].playerKingdom , 'rolePlayer' : Games[indexGame].rolePlayer })
            console.log('rest game.')
        })

        socket.on('on buy', (data )=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null || data['rolePlayer'] != Games[indexGame].rolePlayer )
                return;

            if( data['purchase'] == null && Games[indexGame].players[Games[indexGame].rolePlayer].purchase != null ){
                Games[indexGame].players[data['rolePlayer']].purchase = type_game.wla;
            }else if(data['purchase'] == null){
                Games[indexGame].players[data['rolePlayer']].purchase = type_game.pass;
            }else
                Games[indexGame].players[data['rolePlayer']].purchase = data['purchase'];


            console.log('player ', Games[data['gameIndex']].players[data['rolePlayer']].name , ' try buy ' , Games[indexGame].players[data['rolePlayer']].purchase );

            if(date['purchase'] != type_game.san){
                Games[indexGame].passTurn();
                console.log('is ',date['purchase']);
                socket.to(Games[indexGame].players[Games[indexGame].rolePlayer].id).emit('show choose dialog  re' , { 'listBuyers':Games[indexGame].getBuyers(Games[indexGame].rolePlayer) });
                socket.server.to(Games[indexGame].gameName).emit('start Role re' , { 'playerKingdom':Games[indexGame].playerKingdom , 'rolePlayer' : Games[indexGame].rolePlayer })
            }else {
                console.log('is ',type_game.san);
            }
        
        })
    
        socket.on('pass turn' , (data)=>{
            let indexGame = data['gameIndex'];
            if(indexGame == null)
                return;

            Games[indexGame].passTurn();
            socket.emit('get buyers re',Games[indexGame].getBuyers(Games[indexGame].rolePlayer));
            socket.server.to(Games[indexGame].gameName).emit('start Role re' , { 'playerKingdom':Games[indexGame].playerKingdom , 'rolePlayer' : Games[indexGame].rolePlayer })
   
        })

    },




}