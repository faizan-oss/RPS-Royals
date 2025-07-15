import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

 const handleCreateRoom = async () => {
  try {
    const res = await axios.post("http://localhost:5001/api/room/create", {
      playerName,
    });

    const room = res.data.room;

    localStorage.setItem("playerName", playerName);
    navigate(`/room/${room.roomId}`);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to create room");
  }
};


const handleJoinRoom = async () => {
  try {
    await axios.post("http://localhost:5001/api/room/join", {
      roomId,
      playerName,
    });

    localStorage.setItem("playerName", playerName);
    navigate(`/room/${roomId}`);
  } catch (err) {
    alert(err.response?.data?.message || "Failed to join room");
  }
};

  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-10 px-6 py-10 bg-gradient-to-br from-[#1f1c2c] via-[#2c3e50] to-[#000000] text-white">
      {/* Left Fist */}
      <div className="md:flex-1 flex justify-center">
        <img
          src="/images/fist-left.png"
          alt="Left Fist"
          className="w-32 md:w-48 lg:w-100 object-contain animate-pulse"
        />
      </div>

      {/* Center Form */}
      <div className="md:flex-1 flex flex-col items-center">
        <h1
          className="text-4xl md:text-5xl text-indigo-400 font-bold tracking-widest mb-8 text-center"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          🎮 Royal RPS Arena
        </h1>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-8 w-full max-w-sm text-white">
          <label
            className="block text-sm font-semibold mb-1 text-left"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g. Faizan"
            className="w-full mb-4 px-3 py-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
          />

          <label
            className="block text-sm font-semibold mb-1 text-left"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. room123"
            className="w-full mb-6 px-3 py-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70"
          />

          <div className="space-y-3">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-2 rounded font-semibold shadow-md hover:shadow-purple-500/50 transition"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              🆕 Create Room
            </button>

            <button
              onClick={handleJoinRoom}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-2 rounded font-semibold shadow-md hover:shadow-indigo-500/50 transition"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              🚪 Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Right Fist */}
      <div className="md:flex-1 flex justify-center">
        <img
          src="/images/fist-right.png"
          alt="Right Fist"
          className="w-32 md:w-48 lg:w-100 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}

export default Home;
