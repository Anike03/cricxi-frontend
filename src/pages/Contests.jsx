// src/pages/Contests.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Contests = () => {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllContests = async () => {
      try {
        const res = await axios.get("https://cricxi.onrender.com/api/contests/all");
        console.log("All Contests:", res.data);
        setContests(res.data || []);
      } catch (err) {
        console.error("Error loading contests", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllContests();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center text-white py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-yellow-300 mb-6">All Contests</h1>

        {loading ? (
          <p className="text-gray-300">Loading contests...</p>
        ) : contests.length === 0 ? (
          <p className="text-gray-300">No contests available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {contests.map((contest, idx) => (
              <div
                key={idx}
                className="bg-black/70 p-4 rounded-xl border border-gray-700 shadow-md"
              >
                <h2 className="text-xl font-bold text-green-400 mb-1">{contest.name}</h2>
                <p className="text-sm text-gray-300">
                  {contest.teamA} vs {contest.teamB}
                </p>
                <p className="text-sm text-gray-400">Entry Fee: ₹{contest.entryFee}</p>
                <p className="text-sm text-gray-400">
                  Participants: {contest.joined}/{contest.maxParticipants}
                </p>
                <p className="text-sm text-gray-400">Total Prize: ₹{contest.totalPrize}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Starts at: {new Date(contest.startDate).toLocaleString()}
                </p>
                <Link
                  to={`/join/${contest.id}`}
                  className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                >
                  Join Now
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contests;
