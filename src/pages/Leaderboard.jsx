// src/pages/Leaderboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const Leaderboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get("https://cricxi.onrender.com/api/LeaderboardApi");
        setData(res.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-[url('/stadium-bg.jpg')] bg-cover bg-center text-white py-10 px-4">
      <div className="max-w-4xl mx-auto bg-black/80 p-6 rounded-xl shadow-xl">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">🏆 Leaderboard</h1>

        {loading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-300">No leaderboard data available.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-white table-auto border-collapse border border-gray-500">
              <thead className="bg-yellow-600 text-black">
                <tr>
                  <th className="border border-gray-500 px-4 py-2">Rank</th>
                  <th className="border border-gray-500 px-4 py-2">Username</th>
                  <th className="border border-gray-500 px-4 py-2">Email</th>
                  <th className="border border-gray-500 px-4 py-2">Joined Contests</th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    <td className="border border-gray-500 px-4 py-2">{entry.rank}</td>
                    <td className="border border-gray-500 px-4 py-2">{entry.username}</td>
                    <td className="border border-gray-500 px-4 py-2">{entry.email}</td>
                    <td className="border border-gray-500 px-4 py-2">{entry.joinedContests}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
