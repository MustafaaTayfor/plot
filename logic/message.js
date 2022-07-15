const { use } = require('../app');
const MESSAGE = require ('../models/message');
const USER = require ('../models/users');
const mongoose = require ('mongoose');

module.exports = {

    allMessages :async (req , res)=>{
        console.log("all messages req");
        const messages = await MESSAGE.find();
        
        res.json ({
            result:messages.map(resul =>{
                return {
                    id : resul.id,
                    text : resul.text,
                    userId:resul.userId,
                    date : resul.date,
                    from : resul.from,
                    type : resul.type,
                    voicePath : resul.voicePath,
                }
                
            })
        })
    },

    postMessage : async(req , res )=>{
        console.log("postMessage req");
      const message = await new MESSAGE({
        text : req.body.text,
        date : req.body.date,
        from: req.body.from,
        email: req.body.email,
        userId: req.body.userId,
        type : req.body.type,
        voicePath : req.body.voicePath,
        }).save()

        res.json({
            'message':'sended public message',
            id : message.id,
            userId: message.userId,
            from: message.from,
            email: message.email,
            text: message.text,
            date: message.date,
        })


      


    },

}