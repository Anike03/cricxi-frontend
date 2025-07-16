import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../services/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import api from "../services/api";
import { motion, AnimatePresence } from "framer-motion";

const JoinContest = () => {
  const { contestId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [contest, setContest] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!user?.uid) return;
    
    try {
      const res = await api.get(`/users/${user.uid}/balance`);
      
      if (res.data && res.data.balance !== undefined) {
        setBalance(res.data.balance);
      } else {
        const emailRes = await api.get(`/users/get-by-email?email=${user.email}`);
        if (emailRes.data) {
          setBalance(emailRes.data.walletBalance || 0);
        } else {
          setBalance(0);
        }
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
      try {
        const emailRes = await api.get(`/users/get-by-email?email=${user.email}`);
        if (emailRes.data) {
          setBalance(emailRes.data.walletBalance || 0);
        } else {
          setBalance(0);
        }
      } catch (emailErr) {
        console.error("Fallback email fetch failed:", emailErr);
        setBalance(0);
      }
    }
  }, [user]);

  const fetchContest = useCallback(async () => {
    try {
      const res = await api.get(`/contests/${contestId}`);
      
      if (!res.data) {
        throw new Error("Contest data not found");
      }

      return {
        ...res.data,
        matchId: String(res.data.matchId),
        cricbuzzMatchId: String(res.data.cricbuzzMatchId || res.data.matchId)
      };
    } catch (err) {
      console.error("Fetch contest error:", err);
      throw new Error("Failed to load contest details. Please try again.");
    }
  }, [contestId]);

  const fetchTeams = useCallback(async (matchId) => {
    if (!user?.uid) return [];
    
    try {
      const stringMatchId = String(matchId);
      const q = query(
        collection(db, "fantasyTeams"),
        where("uid", "==", user.uid),
        where("matchId", "==", stringMatchId)
      );

      const snapshot = await getDocs(q);
      const teamList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        matchId: String(doc.data().matchId)
      }));

      return teamList;
    } catch (err) {
      console.error("Team fetch error:", err);
      return [];
    }
  }, [user?.uid]);

  const fetchContestAndTeams = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [contestData,] = await Promise.all([
        fetchContest(),
        fetchBalance()
      ]);

      const teamsData = await fetchTeams(contestData.matchId);

      setContest(contestData);
      setTeams(teamsData);

      if (location.state?.newTeamId) {
        setSelectedTeamId(location.state.newTeamId);
      } else if (location.state?.teamId) {
        setSelectedTeamId(location.state.teamId);
      } else if (teamsData.length === 1) {
        setSelectedTeamId(teamsData[0].id);
      }
    } catch (err) {
      console.error("Error:", err);
      setError(err.message || "Failed to load data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [fetchContest, fetchTeams, fetchBalance, location.state]);

  const handleJoin = async () => {
    if (!selectedTeamId || !contest || !user) {
      return setError("Please select a valid team.");
    }

    const selectedTeam = teams.find(t => t.id === selectedTeamId);
    if (!selectedTeam) {
      return setError("Selected team not found. Please refresh the page.");
    }

    if (contest.entryFee > 0 && balance < contest.entryFee) {
      return setError("Insufficient balance to join this contest");
    }

    try {
      setProcessing(true);
      setError("");
      
      const response = await api.post("/contests/join", {
        contestId: contest.id,
        userId: user.uid,
        teamId: selectedTeamId,
        entryFee: contest.entryFee
      });

      if (response.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate(`/my-teams/${contest.matchId}`, {
            state: { contestJoined: true }
          });
        }, 1500);
      } else {
        throw new Error(response.data.message || "Join failed");
      }
    } catch (err) {
      console.error("Join error:", err);
      setError(err.response?.data?.message || err.message || "Failed to join contest");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchContestAndTeams();
    } else {
      setError("Please login to join contests");
      setLoading(false);
    }
  }, [user, fetchContestAndTeams]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p>Loading contest data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-6 bg-gray-800/80 rounded-lg max-w-md border border-gray-700 text-white">
          <h2 className="text-xl font-bold mb-2 text-yellow-400">Error</h2>
          <p className="mb-4">{error}</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded transition"
            >
              Retry
            </button>
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded transition"
            >
              Go Back
            </button>
            {contest?.matchId && (
              <Link
                to={`/create-team/${contest.matchId}`}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded transition"
              >
                Create Team
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-6">
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-green-600/90 text-white px-6 py-4 rounded-lg shadow-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Successfully joined contest!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-md mx-auto bg-gray-800/70 rounded-xl p-6 border border-gray-700 shadow-lg backdrop-blur-sm">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-yellow-400 mb-2">Join Contest</h1>
          <div className="h-1 bg-gradient-to-r from-yellow-500 to-transparent w-full mb-4"></div>
          
          <div className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold">{contest?.name}</h2>
              <p className="text-gray-300">
                {contest?.teamA} vs {contest?.teamB}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Prize Pool</p>
                <p className="text-lg font-bold">₹{contest?.totalPrize}</p>
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg">
                <p className="text-gray-400 text-sm">Entry Fee</p>
                <p className="text-lg font-bold">₹{contest?.entryFee}</p>
              </div>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Your Balance</p>
              <p className={`text-lg font-bold ${balance >= contest?.entryFee ? "text-green-400" : "text-red-400"}`}>
                ₹{balance.toFixed(2)}
              </p>
            </div>
            
            <div className="bg-gray-700/30 p-3 rounded-lg">
              <p className="text-gray-400 text-sm">Spots</p>
              <div className="flex justify-between items-center">
                <p>{contest?.joined}/{contest?.maxParticipants} joined</p>
                <div className="w-1/2 bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, (contest?.joined/contest?.maxParticipants)*100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-gray-300 mb-2 font-medium">Select Your Team</label>
          
          {teams.length > 0 ? (
            <>
              <select
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg p-3 text-white mb-3 focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              >
                <option value="">-- Select Team --</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.teamName} ({team.players?.length} players)
                  </option>
                ))}
              </select>
              
              {selectedTeamId && (
                <div className="bg-gray-700/30 p-4 rounded-lg border border-gray-600 mb-4">
                  <h3 className="font-medium mb-2">
                    {teams.find(t => t.id === selectedTeamId)?.teamName}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-400">Captain</p>
                      <p>
                        {teams.find(t => t.id === selectedTeamId)?.players?.find(p => p.isCaptain)?.name || "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400">Vice Captain</p>
                      <p>
                        {teams.find(t => t.id === selectedTeamId)?.players?.find(p => p.isViceCaptain)?.name || "Not set"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center p-6 bg-gray-800/50 rounded-lg border border-dashed border-gray-600">
              <p className="text-gray-400 mb-4">You don't have any teams for this match</p>
              <Link
                to={`/create-team/${contest?.matchId}`}
                className="inline-block px-4 py-2 bg-yellow-600 hover:bg-yellow-500 rounded font-medium transition"
              >
                Create Team
              </Link>
            </div>
          )}
        </div>

        {teams.length > 0 && (
          <div className="space-y-4">
            {error && (
              <div className="text-red-400 text-sm p-2 bg-red-900/30 rounded">
                {error}
              </div>
            )}
            
            <motion.button
              whileHover={{ scale: selectedTeamId ? 1.02 : 1 }}
              whileTap={{ scale: selectedTeamId ? 0.98 : 1 }}
              onClick={handleJoin}
              disabled={!selectedTeamId || processing || balance < contest?.entryFee}
              className={`w-full py-3 rounded-lg font-bold transition ${
                selectedTeamId && balance >= contest?.entryFee
                  ? "bg-yellow-600 hover:bg-yellow-500 cursor-pointer"
                  : "bg-gray-700 cursor-not-allowed"
              }`}
            >
              {processing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                `Join Contest`
              )}
            </motion.button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JoinContest;