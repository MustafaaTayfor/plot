const { use } = require('../app');
const MESSAGE = require ('../models/message');

module.exports = {
    getMessage :async (req , res)=>{
        const message = await MESSAGE.find();
        console.log("message req");
        res.json ({
            result:message.map(res =>{
                return {
                    id : res.id,
                    text : res.text,
                    date : res.date,
                    isSender : res.isSender,
                    type : res.type,
                    voicePath : res.voicePath,
                }
                
            })
        })
    },

    postMessage : async(req , res )=>{
        console.log("postMessage req");
        
        const message = await new MESSAGE({
            text : message.text,
            date : message.date,
            isSender : message.isSender,
            type : message.type,
            voicePath : message.voicePath,
        }).save()

        res.json({
            'message':'sended public message',
            id : user.id,
            name: user.name
        })
    },

}