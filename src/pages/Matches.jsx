import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchBackendUpcomingMatches } from "../services/cricbuzz";

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMatches = async () => {
      try {
        const res = await fetchBackendUpcomingMatches();
        console.log("✅ Backend upcoming matches:", res.data);

        if (Array.isArray(res.data)) {
          setMatches(res.data);
        } else {
          console.warn("⚠️ Unexpected match data format:", res.data);
        }
      } catch (err) {
        console.error("❌ Failed to fetch upcoming matches:", err);
      } finally {
        setLoading(false);
      }
    };

    getMatches();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center text-white py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-yellow-400 mb-6 drop-shadow-lg">Upcoming Matches</h1>

        {loading ? (
          <p className="text-white text-lg">Loading matches...</p>
        ) : matches.length === 0 ? (
          <p className="text-white text-lg">No upcoming matches found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matches.map((match, idx) => (
              <div
                key={idx}
                className="bg-black/70 p-4 rounded-xl shadow-md border border-gray-700 backdrop-blur-md"
              >
                <h2 className="text-xl font-bold text-blue-300 mb-1">
                  {match.team1} vs {match.team2}
                </h2>
                <p className="text-sm text-gray-300 mb-1">{match.matchDesc}</p>
                <p className="text-sm italic text-gray-400 mb-1">{match.venue}</p>
                <p className="text-sm text-yellow-400 mb-3">
                  {new Date(match.startDate).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <div className="flex gap-4">
                  <Link
                    to={`/contests/${match.matchId}`}
                    className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-white text-sm"
                  >
                    Join Contest
                  </Link>
                  <Link
                    to={`/create-team/${match.matchId}`}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white text-sm"
                  >
                    Create Team
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
