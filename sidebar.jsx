import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({ currentRoom, onRoomSelect }) {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: "", description: "" });
  const [error, setError] = useState("");
  const { user, logout } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const { data } = await axios.get("/api/rooms");
      setRooms(data);
    } catch (err) {
      console.error(err);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await axios.post("/api/rooms", newRoom);
      setRooms([data, ...rooms]);
      setNewRoom({ name: "", description: "" });
      setShowCreate(false);
      onRoomSelect(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
    }
  };

  const avatarLetter = (name) => name?.[0]?.toUpperCase() || "?";
  const avatarColor = (name) => {
    const colors = ["bg-purple-600", "bg-blue-600", "bg-emerald-600", "bg-rose-600", "bg-amber-600"];
    return colors[(name?.charCodeAt(0) || 0) % colors.length];
  };

  return (
    <div className="w-72 bg-night-900/90 border-r border-night-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-night-700/50">
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-9 h-9 rounded-xl ${avatarColor(user?.username)} flex items-center justify-center text-white font-bold text-sm`}>
            {avatarLetter(user?.username)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{user?.username}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse-dot" />
              <span className="text-xs text-night-400">Online</span>
            </div>
          </div>
          <button onClick={logout} title="Logout"
            className="p-2 rounded-lg text-night-400 hover:text-white hover:bg-night-700/50 transition-all">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="w-full flex items-center justify-center gap-2 bg-accent/15 hover:bg-accent/25 
            border border-accent/30 text-accent rounded-xl py-2.5 text-sm font-medium transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Room
        </button>

        {showCreate && (
          <form onSubmit={createRoom} className="mt-3 space-y-2 animate-slide-up">
            <input
              type="text"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
              placeholder="Room name"
              required
              className="w-full bg-night-800 border border-night-600/50 rounded-xl px-3 py-2 text-white 
                placeholder-night-500 text-sm focus:outline-none focus:border-accent/60 transition-all"
            />
            <input
              type="text"
              value={newRoom.description}
              onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
              placeholder="Description (optional)"
              className="w-full bg-night-800 border border-night-600/50 rounded-xl px-3 py-2 text-white 
                placeholder-night-500 text-sm focus:outline-none focus:border-accent/60 transition-all"
            />
            {error && <p className="text-red-400 text-xs px-1">{error}</p>}
            <div className="flex gap-2">
              <button type="submit"
                className="flex-1 bg-accent text-white rounded-xl py-2 text-sm font-medium hover:bg-accent-dark transition-all">
                Create
              </button>
              <button type="button" onClick={() => setShowCreate(false)}
                className="flex-1 bg-night-700 text-night-300 rounded-xl py-2 text-sm hover:bg-night-600 transition-all">
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Rooms list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <p className="text-xs font-semibold text-night-500 uppercase tracking-widest px-2 mb-3">Rooms</p>
        {rooms.length === 0 ? (
          <p className="text-night-500 text-sm text-center py-8">No rooms yet. Create one!</p>
        ) : (
          rooms.map((room) => (
            <button
              key={room._id}
              onClick={() => onRoomSelect(room)}
              className={`w-full text-left px-3 py-3 rounded-xl transition-all duration-150 group
                ${currentRoom?._id === room._id
                  ? "bg-accent/20 border border-accent/30 text-white"
                  : "text-night-300 hover:bg-night-800/70 hover:text-white border border-transparent"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                  ${currentRoom?._id === room._id ? "bg-accent/30 text-accent" : "bg-night-700 text-night-400 group-hover:bg-night-600"}`}>
                  #
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{room.name}</p>
                  {room.description && (
                    <p className="text-xs text-night-500 truncate">{room.description}</p>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
