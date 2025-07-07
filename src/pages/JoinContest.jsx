import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const JoinContest = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const user = auth.currentUser;

  // State
  const [contest, setContest] = useState(null);
  const [teams, setTeams] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch contest details
  useEffect(() => {
    const fetchContest = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`https://cricxi.onrender.com/api/contests/${contestId}`);
        setContest(res.data);
      } catch (err) {
        setError('Failed to load contest details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContest();
  }, [contestId]);

  // Fetch user's teams for this match
  useEffect(() => {
    if (!contest?.matchId) return;

    const fetchTeams = async () => {
      try {
        const res = await axios.get(
          `https://cricxi.onrender.com/api/team/match/${contest.matchId}`,
          {
            headers: {
              Authorization: `Bearer ${await user.getIdToken()}`
            }
          }
        );
        setTeams(res.data);
      } catch (err) {
        console.error('Failed to fetch teams', err);
      }
    };

    fetchTeams();
  }, [contest?.matchId, user]);

  // Handle contest joining
  const handleJoin = async () => {
    if (!selectedTeamId) {
      setError('Please select a team');
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        'https://cricxi.onrender.com/api/contest-entry/join',
        {
          contestId,
          teamId: selectedTeamId
        },
        {
          headers: {
            Authorization: `Bearer ${await user.getIdToken()}`
          }
        }
      );
      navigate('/my-contests');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join contest');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Join Contest</h1>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">{error}</div>}

      {contest && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-2">{contest.name}</h2>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-600">Prize Pool</p>
              <p className="font-medium">₹{contest.totalPrize}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Entry Fee</p>
              <p className="font-medium">₹{contest.entryFee}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Spots</p>
              <p className="font-medium">{contest.joined}/{contest.maxParticipants}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Select Your Team</h2>
        
        {teams.length > 0 ? (
          <div className="space-y-3">
            {teams.map(team => (
              <div
                key={team._id}
                onClick={() => setSelectedTeamId(team._id)}
                className={`p-4 border rounded cursor-pointer ${
                  selectedTeamId === team._id
                    ? 'bg-blue-50 border-blue-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">{team.teamName}</h3>
                  <span className="text-sm text-gray-600">
                    {team.players.length}/11 players
                  </span>
                </div>
                <div className="mt-2 text-sm">
                  <p>
                    Captain: {team.players.find(p => p.isCaptain)?.name || 'Not set'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You haven't created any teams for this match yet</p>
            <button
              onClick={() => navigate(`/create-team/${contest?.matchId}`)}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Create Team Now
            </button>
          </div>
        )}

        {teams.length > 0 && (
          <button
            onClick={handleJoin}
            disabled={loading || !selectedTeamId}
            className={`mt-6 w-full py-2 rounded font-medium ${
              selectedTeamId
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            {loading ? 'Joining...' : 'Join Contest'}
          </button>
        )}
      </div>
    </div>
  );
};

export default JoinContest;