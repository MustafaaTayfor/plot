const mongoose = require("mongoose");
const {USER} = require('../models/users').schema;
const Schema = mongoose.Schema;

const MessageScema = new Schema({
    text : String,
    date : String,
    from : String,
    email : String,
    userId : mongoose.Types.ObjectId,
    type : String,
    voicePath : String,
});

const message = mongoose.model("public Message" , MessageScema);


module.exports = message;

