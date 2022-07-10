const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageScema = new Schema({
    text : String,
    date : String,
    isSender : String,
    type : String,
    voicePath : String,
});

const message = mongoose.model("publicMessage" , MessageScema);

module.exports = message;