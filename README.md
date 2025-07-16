# 🏆 RPS Royals - Multiplayer Rock Paper Scissors Game
# 🚀 Live Demo

- 🎮 Play the game: [RPS Royals on Vercel](https://rps-royals.vercel.app/)
- 🌐 Backend API: [Render API Endpoint](https://rps-royals.onrender.com)

**RPS Royals** is a real-time, multiplayer rock-paper-scissors game built with **React**, **Node.js**, **Socket.IO**, and **MongoDB**. Two players can join a room and compete in a best-of-5 match — all live and synchronized across both browsers!

## 🚀 Features

- 🧑‍🤝‍🧑 Create or join a game room with a unique room ID
- 🗿📄✂️ Play rock, paper, or scissors against your opponent
- 🔁 Game resets automatically after every round (until someone reaches 5)
- 🏁 Winner is declared once a player scores 5 points
- 🔴 Real-time gameplay using **Socket.IO**
- 🛢 MongoDB stores match info and player details
- 🌐 Easily deployable to Vercel (frontend) and Render (backend)
- ### 💬 Live Chat (New!)
# 🔴 Live Features
- Players inside a room can now **chat in real-time**.

This game is powered by **Socket.IO** to enable real-time multiplayer gameplay and communication.

### 🧩 Real-Time Multiplayer
- Players can **create** or **join a room** using a unique Room ID.
- The game state (moves, scores, rounds) is **synced instantly** between both players.

### 💬 Live Chat (New!)
- Players inside a room can now **chat in real-time**.
- Messages are visible **only to the current room participants**.
- Built using **Socket.IO**, ensuring instant communication.
- Helps improve **player engagement and coordination** during the match.
## 🕹️ How to Play the Game

1. One player clicks **"Create Room"** and enters their name.
2. A unique Room ID is generated.
3. The second player clicks **"Join Room"**, enters their name and the Room ID.
4. Both players will enter the same game room.
5. Each player selects a move: **Stone**, **Paper**, or **Scissor**.
6. When both players have submitted their move:
   - The result of the round is displayed (winner or draw).
   - The score is updated.
7. The game automatically proceeds to the next round after 2.5 seconds.
8. First player to reach **5 points** is declared the winner.
9. After the match:
   - Players can choose **"Play Again"** or **"Back to Home"**.

> Note: For best multiplayer testing, use two separate browser windows or incognito mode for the second player.

## 🛠️ Tech Stack

- **Frontend:** React + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Websockets:** Socket.IO
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel (client), Render (server)

## 📂 Project Structure

RPS-Royals/
├── client/ # React frontend
│ ├── public/
│ └── src/
├── server/ # Node.js backend with Socket.IO
│ └── models/
└── README.md

yaml
Copy
Edit

## ✅ Future Improvements

- 🧑‍🎨 Animated gestures and emojis
- 🧠 Add AI mode (play vs computer)
- 📱 Mobile responsiveness
- 📊 Leaderboard system


---

> Built by [Faizan Rahman Khan](https://github.com/faizan-oss)
