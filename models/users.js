const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userScema = new Schema({
    name : String,
    password : String,
    email : String,
});

const user = mongoose.model("User" , userScema);

module.exports = user;