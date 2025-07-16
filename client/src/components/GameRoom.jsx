import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);
const API = import.meta.env.VITE_BACKEND_URL;

function GameRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  // Remove submitted, add showNextRound
  const [showNextRound, setShowNextRound] = useState(false);
  const playerName = localStorage.getItem("playerName");
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await axios.get(`${API}api/room/${roomId}`);
        setRoom(res.data.room);

        const currentPlayer =
          res.data.room.player1.name === playerName
            ? res.data.room.player1
            : res.data.room.player2;
        // setSubmitted(!!currentPlayer?.move); // No longer needed
      } catch (err) {
        alert("Room not found");
        navigate("/");
      }
    };

    fetchRoom();

    socket.emit("joinRoom", roomId);
    socket.on("roomUpdated", (updatedRoom) => {
      console.log(`[FRONTEND] Room updated:`, updatedRoom);
      setRoom(updatedRoom);
      const currentPlayer =
        updatedRoom.player1.name === playerName
          ? updatedRoom.player1
          : updatedRoom.player2;
      // setSubmitted(!!currentPlayer?.move); // No longer needed

      // If a result is present and not winner, show Next Round button
      if (updatedRoom.result && !updatedRoom.winner) {
        setShowNextRound(true);
      }
      // If both moves are null and no result, hide Next Round button (new round started)
      if (
        updatedRoom.player1.move === null &&
        updatedRoom.player2.move === null &&
        !updatedRoom.result &&
        !updatedRoom.winner
      ) {
        setShowNextRound(false);
      }
      // If winner, hide Next Round button
      if (updatedRoom.winner) {
        setShowNextRound(false);
      }

      if (updatedRoom.result && !updatedRoom.winner) {
        setTimeout(async () => {
          try {
            await axios.post(`${API}api/room/${roomId}/reset`);
            // we don't reset submitted to false until the next move
          } catch (err) {
            console.error("Auto-reset failed:", err);
          }
        }, 2500);
      }
    });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("roomUpdated");
      socket.off("chatMessage");
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId, navigate, playerName]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleMove = async (move) => {
    try {
      console.log(`[FRONTEND] Submitting move:`, { playerName, move });
      await axios.post(`${API}api/room/${roomId}/move`, {
        playerName,
        move,
      });
      // setSubmitted(true); // No longer needed
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleReset = async () => {
    try {
      console.log(`[FRONTEND] Next round requested by:`, playerName);
      await axios.post(`${API}api/room/${roomId}/reset`);
      setShowNextRound(false);
      // setSubmitted(false); // No longer needed
    } catch (err) {
      alert("Unable to reset game");
    }
  };

  const handleBack = () => {
    navigate("/");
  };

  const renderResult = () => {
    if (!room || room.result === null) return "";
    if (room.result === "draw") return "🤝 It's a Draw!";
    const winnerName = room.result === "player1" ? room.player1.name : room.player2.name;
    return `🎯 ${winnerName} wins this round!`;
  };

  const renderWinner = () => {
    if (room?.winner) {
      return (
        <div className="text-2xl font-bold text-green-400 mb-4" style={{ fontFamily: "Orbitron, sans-serif" }}>
          🏆 {room.winner} Wins the Game!
        </div>
      );
    }
    return null;
  };

  const currentPlayer = room?.player1.name === playerName ? room?.player1 : room?.player2;

  // Map move and side to image path
  function getHandImage(move, side) {
    if (move === "stone" || move === null) {
      return side === "left" ? "/images/fist-left.png" : "/images/fist-right.png";
    }
    if (move === "paper") {
      return side === "left" ? "/images/left-paper.png.png" : "/images/right-paper.png.png";
    }
    if (move === "scissor") {
      return side === "left" ? "/images/left-scissors.png.png" : "/images/right-scissors.png.png";
    }
    return side === "left" ? "/images/fist-left.png" : "/images/fist-right.png";
  }

  const sendMessage = () => {
    if (chatInput.trim()) {
      socket.emit("chatMessage", { roomId, playerName, message: chatInput });
      setChatInput("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-10 bg-gradient-to-br from-[#1f1c2c] via-[#2c3e50] to-[#000000] text-white">
      {/* Game area */}
      <div className="md:flex-1 flex justify-center">
        <img
          src={room?.result ? getHandImage(room?.player1?.move, "left") : getHandImage("stone", "left")}
          alt="Left Hand"
          className={`hand-img object-contain ${room?.result ? "animate-shake" : "animate-pulse"}`}
        />
      </div>
      <div className="md:flex-1 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-indigo-400 mb-6 text-center" style={{ fontFamily: "Orbitron, sans-serif" }}>
          🕹️ Game Room: {roomId}
        </h2>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-sm text-white text-center">
          <div className="mb-4 text-lg font-semibold text-indigo-200" style={{ fontFamily: "Orbitron, sans-serif" }}>
            {room?.player1?.name} ({room?.score1 || 0}) vs ({room?.score2 || 0}) {room?.player2?.name}
          </div>

          {renderWinner()}

          {/* Always show move buttons unless the game is over */}
          {!room?.winner && (
            <>
              <h3 className="text-md text-gray-100 mb-3" style={{ fontFamily: "Orbitron, sans-serif" }}>Make your move:</h3>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {["stone", "paper", "scissor"].map((move) => (
                  <button
                    key={move}
                    onClick={() => handleMove(move)}
                    className="bg-indigo-100 text-indigo-700 font-semibold py-2 rounded hover:bg-indigo-200 transition"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                    disabled={currentPlayer?.move} // Disable if this player has already moved
                  >
                    {move.toUpperCase()}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Show the result below the buttons when available */}
          {room?.result && (
            <div className="text-xl font-semibold text-indigo-300 mt-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
              {renderResult()}
            </div>
          )}
          {/* Next Round button, persistent after result until clicked or new round/winner */}
          {showNextRound && !room?.winner && (
            <button
              onClick={handleReset}
              className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              ➡️ Next Round
            </button>
          )}

          {room?.winner && (
            <div className="mt-6 space-x-4">
              <button onClick={handleReset} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition" style={{ fontFamily: "Orbitron, sans-serif" }}>
                🔁 Play Again
              </button>
              <button onClick={handleBack} className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition" style={{ fontFamily: "Orbitron, sans-serif" }}>
                ⬅️ Back to Home
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="md:flex-1 flex justify-center">
        <img
          src={room?.result ? getHandImage(room?.player2?.move, "right") : getHandImage("stone", "right")}
          alt="Right Hand"
          className={`hand-img object-contain ${room?.result ? "animate-shake" : "animate-pulse"}`}
        />
      </div>
      {/* Chat Section */}
      <div className="fixed bottom-0 left-0 w-full md:w-1/2 md:left-1/4 z-50 p-2">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-3 max-h-40 overflow-y-auto mb-2" style={{ fontFamily: "Orbitron, sans-serif" }}>
          <div className="text-indigo-300 font-bold mb-1 text-sm">💬 Chat</div>
          <div className="space-y-1 max-h-24 overflow-y-auto" style={{ minHeight: 40 }}>
            {messages.length === 0 && <div className="text-gray-400 text-xs">No messages yet.</div>}
            {messages.map((msg, idx) => (
              <div key={idx} className={`text-xs ${msg.playerName === playerName ? "text-green-300" : "text-indigo-200"}`}>
                <span className="font-semibold">{msg.playerName}:</span> {msg.message}
                <span className="ml-1 text-xs text-gray-400">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}</span>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
        <div className="flex gap-1">
          <input
            type="text"
            value={chatInput}
            onChange={e => setChatInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            className="flex-1 px-2 py-1 rounded-l bg-white/20 text-white border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70 text-sm"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-3 py-1 rounded-r hover:bg-indigo-700 transition font-semibold text-sm"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default GameRoom;
