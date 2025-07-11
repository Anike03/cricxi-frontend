import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc
} from "firebase/firestore";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// SVG Icons
const TrophyIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744zm0 2.629c0 1.196.312 2.32.857 3.294A5.266 5.266 0 013.16 5.337a45.6 45.6 0 012.006-.343v.256zm13.5 0v-.256c.674.1 1.35.213 2.006.343a5.265 5.265 0 01-2.863 3.207 6.72 6.72 0 00.857-3.294z" clipRule="evenodd" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32l8.4-8.4z" />
    <path d="M5.25 5.25a3 3 0 00-3 3v10.5a3 3 0 003 3h10.5a3 3 0 003-3V13.5a.75.75 0 00-1.5 0v5.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5V8.25a1.5 1.5 0 011.5-1.5h5.25a.75.75 0 000-1.5H5.25z" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
  </svg>
);

const MyTeams = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [expandedTeam, setExpandedTeam] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "fantasyTeams"),
      where("uid", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const result = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setTeams(result.sort((a, b) => b.createdAt - a.createdAt));
      setLoading(false);
      
      if (location.state?.teamCreated) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        navigate(".", { replace: true });
      }
    });

    return () => unsubscribe();
  }, [user, navigate, location.state]);

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this team?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "fantasyTeams", id));
    } catch (err) {
      console.error("Error deleting team:", err);
      alert("Failed to delete team");
    }
  };

  const handleEdit = (team) => {
    const { matchMeta } = team;
    if (!matchMeta || !matchMeta.matchId) {
      alert("Match metadata not available for this team.");
      return;
    }

    navigate(`/create-team/${matchMeta.matchId}`, {
      state: {
        matchData: matchMeta,
        teamToEdit: team
      }
    });
  };

  const handleCreateNew = () => {
    navigate("/matches");
  };

  const toggleExpandTeam = (teamId) => {
    setExpandedTeam(expandedTeam === teamId ? null : teamId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-yellow-400 text-lg">Loading your fantasy teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8 pb-16">
      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-600/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
              <TrophyIcon className="mr-2" />
              <span>Team created successfully!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
            My Fantasy Teams
          </h1>
          <button
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg transition-all"
          >
            <PlusIcon /> Create New Team
          </button>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-16 bg-gray-800/50 rounded-xl border border-gray-700">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="text-3xl text-yellow-500" />
              </div>
              <h3 className="text-xl font-bold mb-2">No fantasy teams yet</h3>
              <p className="text-gray-400 mb-6">
                Create your first fantasy team to get started!
              </p>
              <button
                onClick={handleCreateNew}
                className="bg-yellow-600 hover:bg-yellow-500 text-black px-6 py-2 rounded-lg"
              >
                Create Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {teams.map((team) => (
              <motion.div
                key={team.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gray-800/70 rounded-xl p-5 border border-gray-700 hover:border-yellow-500/30 transition-all shadow-lg"
              >
                {/* Team header */}
                <div 
                  className="flex justify-between items-start cursor-pointer"
                  onClick={() => toggleExpandTeam(team.id)}
                >
                  <div>
                    <h2 className="text-xl font-bold text-yellow-400">
                      {team.teamName}
                    </h2>
                    <p className="text-sm text-gray-400">
                      {team.matchMeta?.team1?.teamSName || team.matchMeta?.team1?.teamName} vs{" "}
                      {team.matchMeta?.team2?.teamSName || team.matchMeta?.team2?.teamName}
                    </p>
                  </div>
                  <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                    {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Expanded team details */}
                {expandedTeam === team.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    {/* Team composition */}
                    <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium text-yellow-400 mb-2">Batting</h3>
                        <ul className="space-y-2">
                          {team.players
                            .filter(p => p.role.includes('Batter') || p.role.includes('WK'))
                            .map(player => (
                              <li key={player.id} className="flex items-center">
                                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                                  {player.role.includes('WK') ? 'WK' : 'BAT'}
                                </span>
                                <span className="truncate flex-1">
                                  {player.name}
                                  {player.isCaptain && (
                                    <span className="ml-1 text-yellow-500 text-xs">(C)</span>
                                  )}
                                  {player.isViceCaptain && (
                                    <span className="ml-1 text-blue-400 text-xs">(VC)</span>
                                  )}
                                </span>
                              </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-medium text-yellow-400 mb-2">Bowling</h3>
                        <ul className="space-y-2">
                          {team.players
                            .filter(p => p.role.includes('Bowler') || p.role.includes('Allrounder'))
                            .map(player => (
                              <li key={player.id} className="flex items-center">
                                <span className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs mr-2">
                                  {player.role.includes('Allrounder') ? 'AR' : 'BOWL'}
                                </span>
                                <span className="truncate flex-1">
                                  {player.name}
                                  {player.isCaptain && (
                                    <span className="ml-1 text-yellow-500 text-xs">(C)</span>
                                  )}
                                  {player.isViceCaptain && (
                                    <span className="ml-1 text-blue-400 text-xs">(VC)</span>
                                  )}
                                </span>
                              </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Match info */}
                    <div className="bg-gray-700/50 p-3 rounded-lg mb-4">
                      <h3 className="font-medium text-yellow-400 mb-2">Match Info</h3>
                      <p className="text-sm">
                        {team.matchMeta?.matchDescription || 'No match description available'}
                      </p>
                      <p className="text-sm text-gray-400 mt-1">
                        {team.matchMeta?.venue || 'Venue not specified'}
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex justify-between gap-3 pt-3 border-t border-gray-700/50">
                      <button
                        onClick={() => handleEdit(team)}
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-600/80 hover:bg-blue-500/80 text-white px-3 py-2 rounded-lg transition"
                      >
                        <EditIcon /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(team.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600/80 hover:bg-red-500/80 text-white px-3 py-2 rounded-lg transition"
                      >
                        <TrashIcon /> Delete
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTeams;