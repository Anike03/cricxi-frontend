import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const JoinContest = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [contest, setContest] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");

  useEffect(() => {
    const fetchContestAndTeams = async () => {
      try {
        const contestRes = await axios.get(`https://cricxi.onrender.com/api/contests/${contestId}`);
        setContest(contestRes.data);

        const teamRes = await axios.get(`https://cricxi.onrender.com/api/team/by-contest/${contestId}`, {
          withCredentials: true,
        });
        setTeams(teamRes.data || []);
      } catch (err) {
        console.error("Error loading contest or teams", err);
      }
    };

    fetchContestAndTeams();
  }, [contestId]);

  const handleJoin = async () => {
    if (!selectedTeamId) {
      alert("Please select a team to join.");
      return;
    }

    try {
      await axios.post(
        `https://cricxi.onrender.com/api/contest-entry/join`,
        {
          contestId,
          teamId: selectedTeamId,
        },
        {
          withCredentials: true,
        }
      );
      navigate("/profile");
    } catch (err) {
      console.error("Failed to join contest", err);
      alert("Failed to join contest.");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center py-10 px-6 text-white">
      <div className="max-w-3xl mx-auto bg-black/70 backdrop-blur p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-4">Join Contest</h1>

        {contest ? (
          <div className="mb-6 border border-gray-700 p-4 rounded">
            <h2 className="text-xl font-semibold text-green-300">{contest.name}</h2>
            <p>🏆 Prize: ₹{contest.totalPrize}</p>
            <p>💸 Entry Fee: ₹{contest.entryFee}</p>
            <p>👥 Max Participants: {contest.maxParticipants}</p>
          </div>
        ) : (
          <p>Loading contest...</p>
        )}

        <div>
          <h3 className="text-lg font-semibold mb-2">Select a team to join:</h3>
          {teams.length > 0 ? (
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
            >
              <option value="">-- Select Your Team --</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name || `Team ${team.id}`}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-sm italic text-red-300">You have no teams for this contest yet.</p>
          )}
        </div>

        <button
          onClick={handleJoin}
          className="mt-6 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded text-white text-lg"
        >
          Join Contest
        </button>
      </div>
    </div>
  );
};

export default JoinContest;
