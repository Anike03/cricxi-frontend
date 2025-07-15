// src/components/ContestLeaderboard.jsx
import { useEffect, useState } from 'react';
import api from '../services/api';

const ContestLeaderboard = ({ contestId }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await api.get(`/contestentry?contestId=${contestId}`);
        setEntries(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEntries();
  }, [contestId]);
  
  if (loading) {
    return <div>Loading leaderboard...</div>;
  }
  
  return (
    <div className="bg-gray-800 rounded-lg p-4 mt-6">
      <h3 className="text-xl font-bold text-yellow-400 mb-4">Leaderboard</h3>
      
      {entries.length === 0 ? (
        <p className="text-gray-400">No entries yet</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-3 text-left">Rank</th>
                <th className="p-3 text-left">Team</th>
                <th className="p-3 text-left">Points</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((entry, index) => (
                <tr key={entry._id} className="border-b border-gray-700">
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{entry.teamName}</td>
                  <td className="p-3">{entry.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ContestLeaderboard;