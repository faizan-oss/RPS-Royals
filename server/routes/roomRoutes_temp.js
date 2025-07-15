const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// Utility
function getWinner(p1, p2) {
  if (p1 === p2) return "draw";
  if ((p1 === "stone" && p2 === "scissor") || (p1 === "paper" && p2 === "stone") || (p1 === "scissor" && p2 === "paper")) {
    return "player1";
  }
  return "player2";
}

// Create Room
router.post("/create", async (req, res) => {
  const { playerName } = req.body;
  const roomId = Math.random().toString(36).substring(2, 8);
  try {
    const room = await Room.create({
      roomId,
      player1: { name: playerName, move: null },
      player2: { name: null, move: null },
      result: null,
      score1: 0,
      score2: 0,
      winner: null,
    });
    res.status(201).json({ message: "Room created", room });
  } catch (err) {
    res.status(500).json({ message: "Failed to create room", error: err.message });
  }
});

// Join Room
router.post("/join", async (req, res) => {
  const { roomId, playerName } = req.body;
  const room = await Room.findOne({ roomId });
  if (!room) return res.status(404).json({ message: "Room not found" });
  if (room.player2?.name) return res.status(400).json({ message: "Room is full" });

  room.player2 = { name: playerName, move: null };
  await room.save();

  const io = req.app.get("io");
  io.to(roomId).emit("roomUpdated", room);
  res.json({ message: "Joined room", room });
});

// Get Room
router.get("/:roomId", async (req, res) => {
  const room = await Room.findOne({ roomId: req.params.roomId });
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ room });
});

// Submit Move
router.post("/:roomId/move", async (req, res) => {
  const { roomId } = req.params;
  const { playerName, move } = req.body;
  const io = req.app.get("io"); // Ensure io is in scope for setTimeout

  if (!["stone", "paper", "scissor"].includes(move)) {
    return res.status(400).json({ message: "Invalid move" });
  }

  try {
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: "Room not found" });
    if (room.winner) return res.status(400).json({ message: "Game already finished" });

    if (room.player1.name === playerName) {
      room.player1.move = move;
    } else if (room.player2?.name === playerName) {
      room.player2.move = move;
    } else {
      return res.status(400).json({ message: "Player not in this room" });
    }

    // Debug log: after setting move
    console.log(`[MOVE] After ${playerName} moved:`, {
      player1: room.player1,
      player2: room.player2,
      result: room.result,
      score1: room.score1,
      score2: room.score2,
      winner: room.winner
    });

    const p1Move = room.player1.move;
    const p2Move = room.player2.move;

    if (p1Move && p2Move) {
      const result = getWinner(p1Move, p2Move);
      room.result = result;

      if (result === "player1") room.score1 += 1;
      else if (result === "player2") room.score2 += 1;

      if (room.score1 === 5) {
        room.winner = room.player1.name;
      } else if (room.score2 === 5) {
        room.winner = room.player2.name;
      }

      // Debug log: after result calculation
      console.log(`[RESULT] After both moved:`, {
        player1: room.player1,
        player2: room.player2,
        result: room.result,
        score1: room.score1,
        score2: room.score2,
        winner: room.winner
      });

      await room.save();
      io.to(roomId).emit("roomUpdated", room);

      // ⏱️ Reset next round after delay (on server)
      if (!room.winner) {
        setTimeout(async () => {
          const fresh = await Room.findOne({ roomId });
          if (fresh && !fresh.winner) {
            fresh.player1.move = null;
            fresh.player2.move = null;
            fresh.result = null;
            await fresh.save();
            // Debug log: after reset
            console.log(`[RESET] After round reset:`, {
              player1: fresh.player1,
              player2: fresh.player2,
              result: fresh.result,
              score1: fresh.score1,
              score2: fresh.score2,
              winner: fresh.winner
            });
            io.to(roomId).emit("roomUpdated", fresh);
          }
        }, 2500);
      }

      return res.status(200).json({ message: "Result calculated", room });
    }

    await room.save();
    io.to(roomId).emit("roomUpdated", room);
    res.status(200).json({ message: "Move submitted", room });
  } catch (err) {
    console.error("Move Error:", err);
    res.status(500).json({ message: "Something went wrong", error: err.message });
  }
});

// Reset Game (between rounds or for 'Play Again')
router.post("/:roomId/reset", async (req, res) => {
  const { roomId } = req.params;
  const room = await Room.findOne({ roomId });
  if (!room) return res.status(404).json({ message: "Room not found" });

  // If the game is over (winner exists), reset everything for 'Play Again'
  if (room.winner) {
    room.score1 = 0;
    room.score2 = 0;
    room.winner = null;
  }

  room.player1.move = null;
  room.player2.move = null;
  room.result = null;

  await room.save();
  const io = req.app.get("io");
  io.to(roomId).emit("roomUpdated", room);
  res.json({ message: "Game reset", room });
});

module.exports = router;
