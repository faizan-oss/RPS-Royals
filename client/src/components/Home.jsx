import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Home() {
  const [playerName, setPlayerName] = useState("");
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const API = import.meta.env.VITE_BACKEND_URL;

 const handleCreateRoom = async () => {
  try {
    const res = await axios.post(`${API}api/room/create`, {
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
    await axios.post(`${API}api/room/join`, {
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
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 px-2 md:px-6 py-6 md:py-10 bg-gradient-to-br from-[#1f1c2c] via-[#2c3e50] to-[#000000] text-white">
      {/* Left Fist */}
      <div className="w-full flex justify-center mb-4 md:mb-0 md:flex-1">
        <img
          src="/images/fist-left.png"
          alt="Left Fist"
          className="w-24 sm:w-32 md:w-48 lg:w-100 object-contain animate-pulse"
        />
      </div>

      {/* Center Form */}
      <div className="w-full md:flex-1 flex flex-col items-center">
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-indigo-400 font-bold tracking-widest mb-4 md:mb-8 text-center"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          🎮 Royal RPS Arena
        </h1>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm text-white">
          <label
            className="block text-xs sm:text-sm font-semibold mb-1 text-left"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g. Faizan"
            className="w-full mb-3 sm:mb-4 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70 text-xs sm:text-base"
          />

          <label
            className="block text-xs sm:text-sm font-semibold mb-1 text-left"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            placeholder="e.g. room123"
            className="w-full mb-4 sm:mb-6 px-2 sm:px-3 py-1.5 sm:py-2 bg-white/20 text-white border border-white/30 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-white/70 text-xs sm:text-base"
          />

          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={handleCreateRoom}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-1.5 sm:py-2 rounded font-semibold shadow-md hover:shadow-purple-500/50 transition text-sm sm:text-base"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              🆕 Create Room
            </button>

            <button
              onClick={handleJoinRoom}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-700 text-white py-1.5 sm:py-2 rounded font-semibold shadow-md hover:shadow-indigo-500/50 transition text-sm sm:text-base"
              style={{ fontFamily: "Orbitron, sans-serif" }}
            >
              🚪 Join Room
            </button>
          </div>
        </div>
      </div>

      {/* Right Fist */}
      <div className="w-full flex justify-center mt-4 md:mt-0 md:flex-1">
        <img
          src="/images/fist-right.png"
          alt="Right Fist"
          className="w-24 sm:w-32 md:w-48 lg:w-100 object-contain animate-pulse"
        />
      </div>
    </div>
  );
}

export default Home;
