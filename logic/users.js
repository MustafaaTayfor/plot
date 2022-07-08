const { use } = require('../app');
const USERS = require ('../models/users');

module.exports = {
    getUsers :async (req , res)=>{
        const users = await USERS.find();
        console.log("users req");
        res.json ({
            result:users.map(res =>{
                return {
                    id : res.id,
                    name : res.name,
                    email : res.email,
                    password : res.password,
                }
                
            })
        })
    },

    registrUser : async(req , res )=>{
        console.log("registr req");
        
        const user = await new USERS({
           name : req.body.name,
           email: req.body.email,
           password : req.body.password,
        }).save()

        res.json({
            'message':'registr successfully',
            id : user.id,
            name: user.name
        })
    },

    loginUser : async(req , res )=>{
        console.log("login req");
        const email = req.body.email;
        const password = req.body.password;

    }




}