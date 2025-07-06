import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const CreateTeam = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    const fetchSquads = async () => {
      try {
        const res = await axios.get(
          `https://Cricbuzz-Official-Cricket-API.proxy-production.allthingsdev.co/match/${matchId}`,
          {
            headers: {
              "x-apihub-key": "yooV5k6f28c0YmtyT6cZg3a8YfwUrKG5yc2WURnhHjEdLat8hS",
              "x-apihub-host": "Cricbuzz-Official-Cricket-API.allthingsdev.co",
              "x-apihub-endpoint": "ac951751-d311-4d23-8f18-353e75432353"
            }
          }
        );
        const squads = res.data.matchInfo?.players || [];
        setPlayers(squads);
      } catch (err) {
        console.error("Error fetching squads", err);
      }
    };
    fetchSquads();
  }, [matchId]);

  const toggleSelect = (player) => {
    if (selected.includes(player)) {
      setSelected(selected.filter((p) => p !== player));
    } else {
      if (selected.length < 11) {
        setSelected([...selected, player]);
      }
    }
  };

  const handleSubmit = async () => {
    if (selected.length !== 11) {
      alert("Please select exactly 11 players.");
      return;
    }
    try {
      await axios.post("https://cricxi.onrender.com/api/team/create", {
        matchId,
        players: selected,
      }, {
        withCredentials: true
      });
      navigate("/profile");
    } catch (err) {
      console.error("Error creating team", err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6">Create Your Team</h1>
        <p className="mb-4">Select 11 players to create your fantasy team.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {players.map((p, idx) => (
            <div
              key={idx}
              onClick={() => toggleSelect(p.name)}
              className={`cursor-pointer p-4 rounded-xl border ${
                selected.includes(p.name) ? "bg-green-600" : "bg-black/60"
              } border-gray-700`}
            >
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <p className="text-sm italic text-gray-300">{p.role || "Unknown"}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white text-lg"
        >
          Submit Team
        </button>
      </div>
    </div>
  );
};

export default CreateTeam;
