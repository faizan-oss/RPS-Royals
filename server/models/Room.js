const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true,
  },
  player1: {
    name: String,
    move: { type: String, enum: ["stone", "paper", "scissor", null], default: null }
  },
  player2: {
      name: { type: String, default: null },
  move: { type: String, enum: ["stone", "paper", "scissor", null], default: null }
  },
  result: {
    type: String, // "draw", "player1", "player2"
    default: null
  },
   score1: { type: Number, default: 0 },
    score2: { type: Number, default: 0 },
    winner: { type: String, default: null },
    createdAt: {
  type: Date,
  default: Date.now,
  expires: 3600 // Room auto-deletes after 1 hour (3600 sec)
}

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
