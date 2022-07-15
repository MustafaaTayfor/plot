const mongoose = require("mongoose");
const playerSchema = require("./player");



const roomSchema = new mongoose.Schema({
  currentRound: {
    required: true,
    type: Number,
    default: 1,
  },
  playerRound: playerSchema,
  playerRoundIndex: Number,
  players: [playerSchema],
  isJoin: {
    type: Boolean,
    default: true,
  },
  turn: playerSchema,
  turnIndex: {
    type: Number,
    default: 0,
  },
});

const roomModel = mongoose.model("Rooms", roomSchema);
module.exports = roomModel;
